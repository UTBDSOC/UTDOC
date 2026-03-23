import EventCreationWizard from "@/components/events/EventCreationWizard";

export default function NewEventPage() {
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

      <EventCreationWizard />
    </div>
  );
}
