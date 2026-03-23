export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Event Detail</h1>
        <p className="mt-1 text-sm text-text-secondary">Event ID: {id}</p>
      </div>

      <div className="rounded-xl bg-bg-card border border-bg-elevated p-8 text-center">
        <p className="text-text-secondary">
          Event detail view coming soon.
        </p>
      </div>
    </div>
  );
}
