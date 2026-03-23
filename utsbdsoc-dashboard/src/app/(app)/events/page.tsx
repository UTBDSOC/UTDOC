import Link from "next/link";
import { Plus } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Events</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all society events.
          </p>
        </div>
        <Link
          href="/events/new"
          className="flex items-center gap-2 rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-base transition-colors hover:bg-accent-gold/90"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </div>

      <div className="rounded-xl bg-bg-card border border-bg-elevated p-8 text-center">
        <p className="text-text-secondary">
          No events yet. Create your first event to get started.
        </p>
      </div>
    </div>
  );
}
