import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, notFound, handleRouteError } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/events/:id/members ────────────────────────────

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    const eventMembers = await prisma.eventMember.findMany({
      where: { eventId: id },
      include: { member: true },
    });

    return ok(
      eventMembers.map((em) => ({
        member_id: em.memberId,
        event_role: em.eventRole,
        name: em.member.name,
        email: em.member.email,
        avatar_url: em.member.avatarUrl,
      })),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── POST /api/events/:id/members ───────────────────────────

const addMemberSchema = z.object({
  member_id: z.string().min(1),
  event_role: z.string().default("member"),
});

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    const body = await request.json();
    const parsed = addMemberSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const em = await prisma.eventMember.upsert({
      where: {
        eventId_memberId: { eventId: id, memberId: parsed.data.member_id },
      },
      update: { eventRole: parsed.data.event_role },
      create: {
        eventId: id,
        memberId: parsed.data.member_id,
        eventRole: parsed.data.event_role,
      },
    });

    return created({
      member_id: em.memberId,
      event_role: em.eventRole,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── DELETE /api/events/:id/members ─────────────────────────

const removeMemberSchema = z.object({
  member_id: z.string().min(1),
});

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const body = await request.json();
    const parsed = removeMemberSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    await prisma.eventMember.deleteMany({
      where: { eventId: id, memberId: parsed.data.member_id },
    });

    return ok({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
