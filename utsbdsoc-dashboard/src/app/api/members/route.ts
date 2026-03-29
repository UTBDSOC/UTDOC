import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeMember } from "@/lib/serializers";
import {
  ok,
  created,
  badRequest,
  forbidden,
  handleRouteError,
} from "@/lib/api-response";
import { MemberRole, Team, Prisma } from "@/generated/prisma";

// ─── GET /api/members ──────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = request.nextUrl;
    const team = searchParams.get("team") as Team | null;
    const role = searchParams.get("role") as MemberRole | null;
    const isActive = searchParams.get("is_active");
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 50)));
    const skip = (page - 1) * limit;

    const where: Prisma.MemberWhereInput = {};

    if (team && Object.values(Team).includes(team)) {
      where.team = team;
    }

    if (role && Object.values(MemberRole).includes(role)) {
      where.role = role;
    }

    if (isActive !== null) {
      where.isActive = isActive !== "false";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: [{ role: "asc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.member.count({ where }),
    ]);

    return ok(members.map(serializeMember), { total, page, limit });
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── POST /api/members ─────────────────────────────────────

const createMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(MemberRole).optional().default("member"),
  team: z.nativeEnum(Team).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { member: currentUser } = await requireAuth();

    if (currentUser.role !== "admin" && currentUser.role !== "team_lead") {
      return forbidden("Only admins and team leads can invite members");
    }

    const body = await request.json();
    const parsed = createMemberSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const { email, role, team } = parsed.data;

    // Check for existing member
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        // Re-activate deactivated member
        const reactivated = await prisma.member.update({
          where: { email },
          data: { isActive: true, role, team },
        });
        return created(serializeMember(reactivated));
      }
      return badRequest("A member with this email already exists");
    }

    // Derive name from email
    const name = email.split("@")[0].replace(/[._-]/g, " ");

    const member = await prisma.member.create({
      data: { email, name, role, team },
    });

    return created(serializeMember(member));
  } catch (error) {
    return handleRouteError(error);
  }
}
