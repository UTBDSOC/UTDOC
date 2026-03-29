import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeEopItem } from "@/lib/serializers";
import {
  ok,
  badRequest,
  notFound,
  handleRouteError,
} from "@/lib/api-response";

type RouteContext = {
  params: Promise<{ id: string; eopItemId: string }>;
};

// ─── PATCH /api/events/:id/eop-items/:eopItemId ────────────

const updateEopItemSchema = z.object({
  is_completed: z.boolean().optional(),
  file_url: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { member } = await requireAuth();
    const { id: eventId, eopItemId } = await context.params;

    const body = await request.json();
    const parsed = updateEopItemSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const existing = await prisma.eopItem.findFirst({
      where: { id: eopItemId, eventId },
    });

    if (!existing) {
      return notFound("EOP item not found");
    }

    const { is_completed, file_url, file_name, notes } = parsed.data;

    const isCompletingNow =
      is_completed === true && !existing.isCompleted;
    const isUncompletingNow =
      is_completed === false && existing.isCompleted;

    const updated = await prisma.eopItem.update({
      where: { id: eopItemId },
      data: {
        ...(is_completed !== undefined && { isCompleted: is_completed }),
        ...(file_url !== undefined && { fileUrl: file_url }),
        ...(file_name !== undefined && { fileName: file_name }),
        ...(notes !== undefined && { notes }),
        ...(isCompletingNow && {
          completedBy: member.id,
          completedAt: new Date(),
        }),
        ...(isUncompletingNow && {
          completedBy: null,
          completedAt: null,
        }),
      },
    });

    return ok(serializeEopItem(updated));
  } catch (error) {
    return handleRouteError(error);
  }
}
