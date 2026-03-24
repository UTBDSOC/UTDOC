export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { serializeMember } from "@/lib/serializers";
import EventCreationWizard from "@/components/events/EventCreationWizard";

export default async function NewEventPage() {
  let serializedTemplates: { id: string; text: string; category: string; sort_order: number }[] = [];
  let serializedMembers: ReturnType<typeof serializeMember>[] = [];

  try {
    const [templates, members] = await Promise.all([
      prisma.taskTemplate.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      }),
      prisma.member.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    serializedTemplates = templates.map((t) => ({
      id: t.id,
      text: t.text,
      category: t.category,
      sort_order: t.sortOrder,
    }));

    serializedMembers = members.map(serializeMember);
  } catch (err) {
    console.warn("Database unavailable, using empty defaults:", (err as Error).message);
  }

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-text-primary font-sans">
          Create New Event
        </h1>
        <p className="mt-2 text-text-secondary max-w-lg mx-auto">
          Set up your event with auto-assigned tasks, team roles, and EOP compliance tracking in a few simple steps.
        </p>
      </div>

      <EventCreationWizard templates={serializedTemplates} members={serializedMembers} />
    </div>
  );
}
