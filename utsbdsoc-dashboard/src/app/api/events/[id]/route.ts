import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeEvent } from "@/lib/serializers";
import {
  ok,
  badRequest,
  forbidden,
  notFound,
  handleRouteError,
} from "@/lib/api-response";
import { EventStatus } from "@/generated/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/events/:id ───────────────────────────────────

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { mainContact: true },
    });

    if (!event) {
      return notFound("Event not found");
    }

    return ok(serializeEvent(event));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── PATCH /api/events/:id ─────────────────────────────────

const updateEventSchema = z.object({
  name: z.string().min(3).optional(),
  date: z.string().optional(),
  venue: z.string().nullable().optional(),
  estimated_attendance: z.number().int().min(0).nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.nativeEnum(EventStatus).optional(),
  main_contact_id: z.string().uuid().nullable().optional(),
  collab_clubs: z.string().nullable().optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { member } = await requireAuth();
    const { id } = await context.params;

    if (member.role !== "admin" && member.role !== "team_lead") {
      return forbidden("Only admins and team leads can edit events");
    }

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return notFound("Event not found");
    }

    const body = await request.json();
    const parsed = updateEventSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const {
      name,
      date,
      venue,
      estimated_attendance,
      description,
      status,
      main_contact_id,
      collab_clubs,
    } = parsed.data;

    const collabArray =
      collab_clubs !== undefined
        ? collab_clubs
          ? collab_clubs
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : []
        : undefined;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(venue !== undefined && { venue }),
        ...(estimated_attendance !== undefined && {
          estimatedAttendance: estimated_attendance,
        }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(main_contact_id !== undefined && { mainContactId: main_contact_id }),
        ...(collabArray !== undefined && { collaboratingClubs: collabArray }),
      },
      include: { mainContact: true },
    });

    return ok(serializeEvent(event));
  } catch (error) {
    return handleRouteError(error);
  }
}
