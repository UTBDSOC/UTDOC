import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  notFound,
  handleRouteError,
} from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

interface SerializedMinutes {
  id: string;
  event_id: string;
  meeting_date: string;
  attendees: string[];
  apologies: string[];
  agenda: string;
  discussion: string;
  action_items: unknown[];
  created_at: string;
}

function serializeMinutes(m: {
  id: string;
  eventId: string;
  date: Date;
  attendees: string[];
  apologies: string[];
  agenda: string | null;
  discussion: string | null;
  actionItems: unknown;
  createdAt: Date;
}): SerializedMinutes {
  return {
    id: m.id,
    event_id: m.eventId,
    meeting_date: m.date.toISOString(),
    attendees: m.attendees,
    apologies: m.apologies,
    agenda: m.agenda ?? "",
    discussion: m.discussion ?? "",
    action_items: Array.isArray(m.actionItems) ? m.actionItems : [],
    created_at: m.createdAt.toISOString(),
  };
}

// ─── GET /api/events/:id/minutes ───────────────────────────

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    const minutes = await prisma.meetingMinutes.findMany({
      where: { eventId: id },
      orderBy: { date: "desc" },
    });

    return ok(minutes.map(serializeMinutes));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── POST /api/events/:id/minutes ──────────────────────────

const createMinutesSchema = z.object({
  meeting_date: z.string().min(1),
  attendees: z.array(z.string()).default([]),
  apologies: z.array(z.string()).default([]),
  agenda: z.string().optional(),
  discussion: z.string().optional(),
  action_items: z
    .array(
      z.object({
        description: z.string(),
        assignee_id: z.string().optional(),
        deadline: z.string().optional(),
        create_task: z.boolean().default(false),
      }),
    )
    .default([]),
});

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { member } = await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    const body = await request.json();
    const parsed = createMinutesSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const data = parsed.data;

    const minutes = await prisma.meetingMinutes.create({
      data: {
        eventId: id,
        date: new Date(data.meeting_date),
        attendees: data.attendees,
        apologies: data.apologies,
        agenda: data.agenda,
        discussion: data.discussion,
        actionItems: JSON.parse(JSON.stringify(data.action_items)),
        createdBy: member.id,
      },
    });

    // Auto-create tasks from action items with create_task=true
    const tasksToCreate = data.action_items.filter((ai) => ai.create_task && ai.description);
    if (tasksToCreate.length > 0) {
      await prisma.task.createMany({
        data: tasksToCreate.map((ai) => ({
          eventId: id,
          text: ai.description,
          category: "GENERAL" as const,
          assigneeId: ai.assignee_id || undefined,
          deadline: ai.deadline ? new Date(ai.deadline) : undefined,
        })),
      });
    }

    return created(serializeMinutes(minutes));
  } catch (error) {
    return handleRouteError(error);
  }
}
