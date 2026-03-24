import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  serializeEvent,
  serializeTask,
  serializeEopItem,
  serializeMember,
} from "@/lib/serializers";
import {
  ok,
  badRequest,
  forbidden,
  notFound,
  handleRouteError,
} from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/events/:id ────────────────────────────────────

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { mainContact: true },
    });

    if (!event) return notFound("Event not found");

    const [tasks, eopItems, members] = await Promise.all([
      prisma.task.findMany({
        where: { eventId: id },
        include: { assignee: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.eopItem.findMany({
        where: { eventId: id },
        orderBy: { itemKey: "asc" },
      }),
      prisma.eventMember.findMany({
        where: { eventId: id },
        include: { member: true },
      }),
    ]);

    const taskCounts = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      blocked: tasks.filter((t) => t.status === "blocked").length,
    };

    const eopProgress = {
      total: eopItems.length,
      completed: eopItems.filter((e) => e.isCompleted).length,
      required: eopItems.filter((e) => e.isRequired).length,
      required_completed: eopItems.filter((e) => e.isRequired && e.isCompleted)
        .length,
    };

    return ok({
      ...serializeEvent(event),
      task_counts: taskCounts,
      eop_progress: eopProgress,
      tasks: tasks.map(serializeTask),
      eop_items: eopItems.map(serializeEopItem),
      members: members.map((em) => serializeMember(em.member)),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── PATCH /api/events/:id ──────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { member } = await requireAuth();
    const { id } = await context.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    // Only admin or creator can update
    const isAdmin = member.role === "admin";
    const isCreator = event.createdById === member.id;
    if (!isAdmin && !isCreator) {
      return forbidden("Only the event creator or an admin can update");
    }

    const body = await request.json();

    // Build update data from allowed fields
    const allowedFields = [
      "name",
      "date",
      "venue",
      "description",
      "status",
      "main_contact_id",
      "main_contact_phone",
      "estimated_attendance",
      "collab_clubs",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        switch (field) {
          case "date":
            updateData.date = new Date(body.date);
            break;
          case "main_contact_id":
            updateData.mainContactId = body.main_contact_id;
            break;
          case "main_contact_phone":
            updateData.mainContactPhone = body.main_contact_phone;
            break;
          case "estimated_attendance":
            updateData.estimatedAttendance = body.estimated_attendance;
            break;
          case "collab_clubs": {
            const clubs =
              typeof body.collab_clubs === "string"
                ? body.collab_clubs
                    .split(",")
                    .map((c: string) => c.trim())
                    .filter(Boolean)
                : body.collab_clubs;
            updateData.collaboratingClubs = clubs;
            break;
          }
          default:
            updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return badRequest("No valid fields to update");
    }

    const updated = await prisma.event.update({
      where: { id },
      data: updateData,
      include: { mainContact: true },
    });

    return ok(serializeEvent(updated));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── DELETE /api/events/:id (soft delete) ───────────────────

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { member } = await requireAuth();
    const { id } = await context.params;

    if (member.role !== "admin") {
      return forbidden("Only admins can archive events");
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    const updated = await prisma.event.update({
      where: { id },
      data: { status: "archived" },
      include: { mainContact: true },
    });

    return ok(serializeEvent(updated));
  } catch (error) {
    return handleRouteError(error);
  }
}
