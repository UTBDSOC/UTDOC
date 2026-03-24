export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  serializeEvent,
  serializeTask,
  serializeEopItem,
  serializeMember,
  serializeEventFile,
} from "@/lib/serializers";
import EventDetail from "@/components/events/EventDetail";
import { notFound } from "next/navigation";
import { mockEvents, mockTasks, mockMembers, mockMinutes } from "@/lib/mock-data";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { mainContact: true },
    });

    if (!event) {
      notFound();
    }

    const [tasks, eopItems, files, eventMembers] = await Promise.all([
      prisma.task.findMany({
        where: { eventId: id },
        include: { assignee: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.eopItem.findMany({
        where: { eventId: id },
        orderBy: { itemKey: "asc" },
      }),
      prisma.eventFile.findMany({
        where: { eventId: id },
        include: { uploader: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.eventMember.findMany({
        where: { eventId: id },
        include: { member: true },
      }),
    ]);

    return (
      <EventDetail
        event={serializeEvent(event)}
        tasks={tasks.map(serializeTask)}
        members={eventMembers.map((em) => serializeMember(em.member))}
        eopItems={eopItems.map(serializeEopItem)}
        files={files.map(serializeEventFile)}
        minutes={[]}
      />
    );
  } catch (err) {
    console.warn("Database unavailable, using mock data:", (err as Error).message);

    const mockEvent = mockEvents.find((e) => e.id === id);
    if (!mockEvent) {
      notFound();
    }

    const eventTasks = mockTasks.filter((t) => t.event_id === id);

    return (
      <EventDetail
        event={mockEvent}
        tasks={eventTasks}
        members={mockMembers}
        eopItems={[]}
        files={[]}
        minutes={mockMinutes}
      />
    );
  }
}
