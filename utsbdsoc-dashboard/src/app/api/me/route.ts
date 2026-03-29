import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serializeMember } from "@/lib/serializers";
import { ok, badRequest, handleRouteError } from "@/lib/api-response";
import type { Prisma } from "@/generated/prisma";

// ─── GET /api/me ───────────────────────────────────────────

export async function GET() {
  try {
    const { member } = await requireAuth();

    const full = await prisma.member.findUniqueOrThrow({
      where: { id: member.id },
    });

    return ok({
      ...serializeMember(full),
      notification_prefs: full.notificationPrefs,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

// ─── PATCH /api/me ─────────────────────────────────────────

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  avatar_url: z.string().nullable().optional(),
  notification_prefs: z
    .object({
      email: z.boolean().optional(),
      in_app: z.boolean().optional(),
      discord: z.boolean().optional(),
      reminder_days: z.number().int().min(0).max(30).optional(),
      discord_webhook: z.string().optional(),
    })
    .optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { member } = await requireAuth();

    const body = await request.json();
    const parsed = updateMeSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
    }

    const { name, avatar_url, notification_prefs } = parsed.data;

    // Merge notification prefs with existing
    let mergedPrefs = member.notificationPrefs;
    if (notification_prefs) {
      const existing =
        typeof member.notificationPrefs === "object" && member.notificationPrefs !== null
          ? (member.notificationPrefs as Record<string, unknown>)
          : {};
      mergedPrefs = { ...existing, ...notification_prefs };
    }

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        ...(name !== undefined && { name }),
        ...(avatar_url !== undefined && { avatarUrl: avatar_url }),
        ...(notification_prefs && { notificationPrefs: mergedPrefs as Prisma.InputJsonValue }),
      },
    });

    return ok({
      ...serializeMember(updated),
      notification_prefs: updated.notificationPrefs,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
