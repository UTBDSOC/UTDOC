import { ProgressRing } from "@/components/progress-ring";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          President&apos;s Command Centre
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of all events, tasks, and team activity.
        </p>
      </div>

      {/* Placeholder stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Events", value: "0" },
          { label: "Open Tasks", value: "0" },
          { label: "Team Members", value: "0" },
          { label: "EOP Compliance", value: "0%" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-bg-card border border-bg-elevated p-5"
          >
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-bg-card border border-bg-elevated p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Upcoming Events
          </h2>
          <p className="mt-4 text-sm text-text-secondary">
            No upcoming events yet.
          </p>
        </div>
        <div className="rounded-xl bg-bg-card border border-bg-elevated p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Task Overview
          </h2>
          <div className="mt-4 flex items-center justify-center">
            <ProgressRing percentage={0} size={80} strokeWidth={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
