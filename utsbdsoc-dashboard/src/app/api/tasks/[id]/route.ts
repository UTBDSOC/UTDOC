import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeTask } from "@/lib/serializers";
import {
  ok,
  badRequest,
  notFound,
  handleRouteError,
} from "@/lib/api-response";
import { TaskStatus } from "@/generated/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/tasks/:id ────────────────────────────────────

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true },
    });

    if (!task) {
      return notFound("Task not found");
    }

    return ok(serializeTask(task));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── PATCH /api/tasks/:id ──────────────────────────────────

const updateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  deadline: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  text: z.string().min(1).optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return notFound("Task not found");
    }

    const { status, assignee_id, deadline, notes, text } = parsed.data;

    // Auto-set completed_at when status changes to completed
    const isCompletingNow =
      status === "completed" && existing.status !== "completed";
    const isUncompletingNow =
      status !== undefined && status !== "completed" && existing.status === "completed";

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(assignee_id !== undefined && { assigneeId: assignee_id }),
        ...(deadline !== undefined && {
          deadline: deadline ? new Date(deadline) : null,
        }),
        ...(notes !== undefined && { notes }),
        ...(text !== undefined && { text }),
        ...(isCompletingNow && { completedAt: new Date() }),
        ...(isUncompletingNow && { completedAt: null }),
      },
      include: { assignee: true },
    });

    return ok(serializeTask(task));
  } catch (error) {
    return handleRouteError(error);
  }
}
