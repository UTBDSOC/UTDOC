import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ok, handleRouteError } from "@/lib/api-response";
import { categoryLabel } from "@/lib/serializers";
import type { TaskCategory } from "@/generated/prisma";

interface SerializedTemplate {
  id: string;
  text: string;
  category: string;
  category_key: TaskCategory;
  default_team: string | null;
  is_eop_related: boolean;
  sort_order: number;
}

interface GroupedTemplates {
  category: string;
  category_key: TaskCategory;
  templates: SerializedTemplate[];
}

// ─── GET /api/task-templates ───────────────────────────────

export async function GET() {
  try {
    await requireAuth();

    const templates = await prisma.taskTemplate.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });

    // Group by category
    const grouped = templates.reduce<Record<string, GroupedTemplates>>(
      (acc, t) => {
        const key = t.category;
        if (!acc[key]) {
          acc[key] = {
            category: categoryLabel(key),
            category_key: key,
            templates: [],
          };
        }
        acc[key].templates.push({
          id: t.id,
          text: t.text,
          category: categoryLabel(t.category),
          category_key: t.category,
          default_team: t.defaultTeam,
          is_eop_related: t.isEopRelated,
          sort_order: t.sortOrder,
        });
        return acc;
      },
      {},
    );

    return ok(Object.values(grouped));
  } catch (error) {
    return handleRouteError(error);
  }
}
