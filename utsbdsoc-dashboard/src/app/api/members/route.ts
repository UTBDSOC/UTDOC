import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeMember } from "@/lib/serializers";
import { ok, handleRouteError } from "@/lib/api-response";
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
