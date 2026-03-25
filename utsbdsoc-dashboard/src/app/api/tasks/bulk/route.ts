import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeTask } from "@/lib/serializers";
import {
  ok,
  badRequest,
  forbidden,
  handleRouteError,
} from "@/lib/api-response";
import { TaskStatus } from "@/generated/prisma";

// ─── PATCH /api/tasks/bulk ─────────────────────────────────

const bulkUpdateSchema = z.object({
  task_ids: z.array(z.string().uuid()).min(1).max(100),
  updates: z.object({
    status: z.nativeEnum(TaskStatus).optional(),
    assignee_id: z.string().uuid().nullable().optional(),
  }),
});

export async function PATCH(request: NextRequest) {
  try {
    const { member } = await requireAuth();

    if (member.role !== "admin" && member.role !== "team_lead") {
      return forbidden("Only admins and team leads can bulk update tasks");
    }

    const body = await request.json();
    const parsed = bulkUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const { task_ids, updates } = parsed.data;

    const isCompleting = updates.status === "completed";
    const now = new Date();

    await prisma.task.updateMany({
      where: { id: { in: task_ids } },
      data: {
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.assignee_id !== undefined && {
          assigneeId: updates.assignee_id,
        }),
        ...(isCompleting && { completedAt: now }),
      },
    });

    // Return updated tasks
    const tasks = await prisma.task.findMany({
      where: { id: { in: task_ids } },
      include: { assignee: true },
      orderBy: { createdAt: "asc" },
    });

    return ok(tasks.map(serializeTask));
  } catch (error) {
    return handleRouteError(error);
  }
}
