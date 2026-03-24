import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateEopItems } from "@/lib/eop";
import { serializeEvent } from "@/lib/serializers";
import {
  ok,
  created,
  badRequest,
  forbidden,
  handleRouteError,
} from "@/lib/api-response";
import { EventStatus, Prisma } from "@/generated/prisma";

// ─── GET /api/events ────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") as EventStatus | null;
    const search = searchParams.get("search");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (status && Object.values(EventStatus).includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { venue: { contains: search, mode: "insensitive" } },
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { mainContact: true },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return ok(events.map(serializeEvent), { total, page, limit });
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── POST /api/events ───────────────────────────────────────

const createEventSchema = z.object({
  name: z.string().min(3),
  date: z.string().min(1),
  venue: z.string().optional(),
  estimated_attendance: z.number().int().min(0).optional(),
  description: z.string().optional(),
  collab_clubs: z.string().optional(),
  main_contact_id: z.string().uuid().optional(),
  main_contact_phone: z.string().optional(),
  selected_template_ids: z.array(z.string().uuid()).default([]),
  member_ids: z.array(z.string().uuid()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const { member } = await requireAuth();

    // Only admin or team_lead can create events
    if (member.role !== "admin" && member.role !== "team_lead") {
      return forbidden("Only admins and team leads can create events");
    }

    const body = await request.json();
    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const data = parsed.data;
    const eventDate = new Date(data.date);
    const collabClubs = data.collab_clubs
      ? data.collab_clubs.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    // Fetch selected templates
    const templates =
      data.selected_template_ids.length > 0
        ? await prisma.taskTemplate.findMany({
            where: { id: { in: data.selected_template_ids } },
          })
        : [];

    // Generate EOP items
    const eopItemDefs = generateEopItems({
      eventDate,
      venue: data.venue,
    });

    // Single transaction: create event + tasks + EOP items + members
    const event = await prisma.$transaction(async (tx) => {
      const newEvent = await tx.event.create({
        data: {
          name: data.name,
          date: eventDate,
          venue: data.venue,
          estimatedAttendance: data.estimated_attendance,
          description: data.description,
          mainContactId: data.main_contact_id,
          mainContactPhone: data.main_contact_phone,
          createdById: member.id,
          collaboratingClubs: collabClubs,
          status: "planning",
        },
      });

      // Clone templates -> tasks
      if (templates.length > 0) {
        await tx.task.createMany({
          data: templates.map((t) => ({
            eventId: newEvent.id,
            templateId: t.id,
            text: t.text,
            category: t.category,
            sortOrder: t.sortOrder,
          })),
        });
      }

      // Create EOP items
      await tx.eopItem.createMany({
        data: eopItemDefs.map((item) => ({
          eventId: newEvent.id,
          itemKey: item.itemKey,
          label: item.label,
          isRequired: item.isRequired,
        })),
      });

      // Create event members
      const memberIds = [...new Set([member.id, ...data.member_ids])];
      await tx.eventMember.createMany({
        data: memberIds.map((mid) => ({
          eventId: newEvent.id,
          memberId: mid,
          eventRole: mid === member.id ? "creator" : "member",
        })),
        skipDuplicates: true,
      });

      return tx.event.findUniqueOrThrow({
        where: { id: newEvent.id },
        include: { mainContact: true },
      });
    });

    return created(serializeEvent(event));
  } catch (error) {
    return handleRouteError(error);
  }
}
