import { cn } from "@/lib/utils";

const teamStyles: Record<string, string> = {
  MARKETING: "bg-team-pink/20 text-team-pink",
  LOGISTICS: "bg-team-blue/20 text-team-blue",
  FINANCE: "bg-team-green/20 text-team-green",
  CREATIVE: "bg-team-purple/20 text-team-purple",
  OPERATIONS: "bg-team-red/20 text-team-red",
};

const teamLabels: Record<string, string> = {
  MARKETING: "Marketing",
  LOGISTICS: "Logistics",
  FINANCE: "Finance",
  CREATIVE: "Creative",
  OPERATIONS: "Operations",
};

interface TeamBadgeProps {
  team: string;
  className?: string;
}

export function TeamBadge({ team, className }: TeamBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        teamStyles[team] ?? "bg-bg-elevated text-text-secondary",
        className
      )}
    >
      {teamLabels[team] ?? team}
    </span>
  );
}
