import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeTask } from "@/lib/serializers";
import {
  ok,
  created,
  badRequest,
  handleRouteError,
} from "@/lib/api-response";
import { TaskStatus, TaskCategory, Prisma } from "@/generated/prisma";

// ─── GET /api/tasks ─────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { member } = await requireAuth();

    const { searchParams } = request.nextUrl;
    const eventId = searchParams.get("event_id");
    const assigneeId = searchParams.get("assignee_id");
    const status = searchParams.get("status") as TaskStatus | null;
    const category = searchParams.get("category") as TaskCategory | null;
    const overdue = searchParams.get("overdue");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 50)));
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {};

    if (eventId) {
      where.eventId = eventId;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId === "me" ? member.id : assigneeId;
    }

    if (status && Object.values(TaskStatus).includes(status)) {
      where.status = status;
    }

    if (category && Object.values(TaskCategory).includes(category)) {
      where.category = category;
    }

    if (overdue === "true") {
      where.deadline = { lt: new Date() };
      where.status = { not: "completed" };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { assignee: true },
        orderBy: [{ deadline: "asc" }, { sortOrder: "asc" }],
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return ok(tasks.map(serializeTask), { total, page, limit });
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── POST /api/tasks ────────────────────────────────────────

const createTaskSchema = z.object({
  event_id: z.string().uuid(),
  text: z.string().min(1),
  category: z.nativeEnum(TaskCategory),
  assignee_id: z.string().uuid().optional(),
  deadline: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const { event_id, text, category, assignee_id, deadline } = parsed.data;

    const task = await prisma.task.create({
      data: {
        eventId: event_id,
        text,
        category,
        assigneeId: assignee_id,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: { assignee: true },
    });

    return created(serializeTask(task));
  } catch (error) {
    return handleRouteError(error);
  }
}
