import Link from "next/link";
import { Plus } from "lucide-react";
import EventList from "@/components/events/EventList";
import { mockEvents } from "@/lib/mock-data";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-sans">Event Management</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Centralized hub for all society planning, operations, and compliance.
          </p>
        </div>
        <Link
          href="/events/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-accent-gold px-6 py-3 text-sm font-bold text-bg-primary transition-all hover:bg-accent-gold/90 shadow-lg shadow-accent-gold/10"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </div>

      <EventList events={mockEvents} />

      {/* Floating Action Button */}
      <Link
        href="/events/new"
        className="fixed bottom-24 right-8 lg:bottom-12 lg:right-12 w-14 h-14 rounded-full bg-accent-gold text-bg-primary flex items-center justify-center shadow-[0_0_30px_#E8C547] hover:scale-110 active:scale-95 transition-all z-50 group"
        aria-label="New Event"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </div>
  );
}
