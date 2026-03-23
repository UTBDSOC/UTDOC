import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  NOT_STARTED: "bg-text-secondary/20 text-text-secondary",
  IN_PROGRESS: "bg-team-blue/20 text-team-blue",
  COMPLETED: "bg-team-green/20 text-team-green",
  BLOCKED: "bg-team-red/20 text-team-red",
  DRAFT: "bg-text-secondary/20 text-text-secondary",
  PLANNING: "bg-team-purple/20 text-team-purple",
  READY: "bg-accent-gold/20 text-accent-gold",
  CANCELLED: "bg-team-red/20 text-team-red",
};

const statusLabels: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  DRAFT: "Draft",
  PLANNING: "Planning",
  READY: "Ready",
  CANCELLED: "Cancelled",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-bg-elevated text-text-secondary",
        className
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
