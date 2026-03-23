export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">My Tasks</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Your assigned tasks across all events.
        </p>
      </div>

      <div className="rounded-xl bg-bg-card border border-bg-elevated p-8 text-center">
        <p className="text-text-secondary">
          No tasks assigned to you yet.
        </p>
      </div>
    </div>
  );
}
