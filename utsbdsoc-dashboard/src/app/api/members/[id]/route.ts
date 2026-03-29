import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeMember } from "@/lib/serializers";
import {
  ok,
  badRequest,
  forbidden,
  notFound,
  handleRouteError,
} from "@/lib/api-response";
import { MemberRole, Team } from "@/generated/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/members/:id ──────────────────────────────────

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return notFound("Member not found");

    return ok(serializeMember(member));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── PATCH /api/members/:id ────────────────────────────────

const updateMemberSchema = z.object({
  role: z.nativeEnum(MemberRole).optional(),
  team: z.nativeEnum(Team).nullable().optional(),
  is_active: z.boolean().optional(),
  position_title: z.string().nullable().optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { member: currentUser } = await requireAuth();
    const { id } = await context.params;

    if (currentUser.role !== "admin") {
      return forbidden("Only admins can update member details");
    }

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) return notFound("Member not found");

    const body = await request.json();
    const parsed = updateMemberSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const { role, team, is_active, position_title } = parsed.data;

    const updated = await prisma.member.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(team !== undefined && { team }),
        ...(is_active !== undefined && { isActive: is_active }),
        ...(position_title !== undefined && { positionTitle: position_title }),
      },
    });

    return ok(serializeMember(updated));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── DELETE /api/members/:id (soft delete) ──────────────────

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { member: currentUser } = await requireAuth();
    const { id } = await context.params;

    if (currentUser.role !== "admin") {
      return forbidden("Only admins can remove members");
    }

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) return notFound("Member not found");

    const updated = await prisma.member.update({
      where: { id },
      data: { isActive: false },
    });

    return ok(serializeMember(updated));
  } catch (error) {
    return handleRouteError(error);
  }
}
