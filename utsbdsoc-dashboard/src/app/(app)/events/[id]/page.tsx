import { mockEvents, mockTasks, mockMembers } from "@/lib/mock-data";
import EventDetail from "@/components/events/EventDetail";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const event = mockEvents.find(e => e.id === id);
  if (!event) {
    notFound();
  }

  const tasks = mockTasks.filter(t => t.event_id === id);

  return (
    <EventDetail 
      event={event} 
      tasks={tasks} 
      members={mockMembers} 
    />
  );
}
