import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, handleRouteError } from "@/lib/api-response";

interface SerializedNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

function serializeNotification(n: {
  id: string;
  type: string;
  title: string;
  body: string | null;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: Date;
}): SerializedNotification {
  let link: string | undefined;
  if (n.referenceType === "event" && n.referenceId) {
    link = `/events/${n.referenceId}`;
  } else if (n.referenceType === "task" && n.referenceId) {
    link = `/my-tasks`;
  }

  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body ?? "",
    is_read: n.isRead,
    link,
    created_at: n.createdAt.toISOString(),
  };
}

// ─── GET /api/notifications ─────────────────────────────────

export async function GET() {
  try {
    const { member } = await requireAuth();

    const notifications = await prisma.notification.findMany({
      where: { recipientId: member.id, channel: "IN_APP" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return ok(notifications.map(serializeNotification));
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── PATCH /api/notifications ───────────────────────────────

const patchSchema = z.object({
  notification_ids: z.array(z.string()).optional(),
  mark_all_read: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { member } = await requireAuth();

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const { notification_ids, mark_all_read } = parsed.data;

    if (mark_all_read) {
      await prisma.notification.updateMany({
        where: { recipientId: member.id, isRead: false },
        data: { isRead: true },
      });
    } else if (notification_ids && notification_ids.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: { in: notification_ids },
          recipientId: member.id,
        },
        data: { isRead: true },
      });
    } else {
      return badRequest("Provide notification_ids or mark_all_read");
    }

    return ok({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
