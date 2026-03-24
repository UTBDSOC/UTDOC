interface EopGenerationContext {
  eventDate?: Date | null;
  venue?: string | null;
}

interface EopItemDef {
  itemKey: string;
  label: string;
  isRequired: boolean;
}

const LATE_NIGHT_VENUES = [
  "Alumni Green",
  "Concourse",
  "Building 2 Roof Top",
  "Great Hall",
  "Student Learning Hub",
];

function isLateNightOrWeekend(date: Date): boolean {
  const hours = date.getHours();
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const isLateWeekday = hours >= 22;
  return isWeekend || isLateWeekday;
}

function requiresFloorPlan(venue: string | null | undefined): boolean {
  if (!venue) return false;
  return LATE_NIGHT_VENUES.some(
    (v) => venue.toLowerCase().includes(v.toLowerCase()),
  );
}

/**
 * Generate the 7 standard EOP checklist items for an event.
 * `is_required` varies based on event time and venue per spec.
 */
export function generateEopItems(ctx: EopGenerationContext): EopItemDef[] {
  const lateNight = ctx.eventDate
    ? isLateNightOrWeekend(ctx.eventDate)
    : false;
  const needsFloorPlan = requiresFloorPlan(ctx.venue);

  return [
    { itemKey: "risk_assessment", label: "Risk Assessment", isRequired: true },
    {
      itemKey: "food_handling",
      label: "Food Handling Certificate",
      isRequired: true,
    },
    {
      itemKey: "facilities_request",
      label: "Facilities Request",
      isRequired: true,
    },
    { itemKey: "run_sheet", label: "Run Sheet", isRequired: true },
    { itemKey: "emergency_plan", label: "Emergency Plan", isRequired: true },
    {
      itemKey: "external_list",
      label: "External Attendee List",
      isRequired: lateNight,
    },
    { itemKey: "floor_plan", label: "Floor Plan", isRequired: needsFloorPlan },
  ];
}
