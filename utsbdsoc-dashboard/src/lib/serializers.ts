import type {
  Member as PrismaMember,
  Event as PrismaEvent,
  Task as PrismaTask,
  EopItem as PrismaEopItem,
  EventFile as PrismaEventFile,
  TaskCategory,
} from "@/generated/prisma";
import type { Member, Event, Task, EOPItem, EventFile } from "@/types";

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  GENERAL: "General",
  CONTRACTS_PROPOSALS: "Contracts & Proposals",
  MARKETING: "Marketing",
  EVENT_PROGRAM: "Event Program",
  DECORATIONS: "Decorations",
  FOOD_CATERING: "Food & Catering",
  FINANCE: "Finance",
};

export function serializeMember(m: PrismaMember): Member {
  return {
    id: m.id,
    email: m.email,
    full_name: m.name,
    role: m.role,
    team: (m.team ?? "general") as Member["team"],
    avatar_url: m.avatarUrl ?? undefined,
    created_at: m.createdAt.toISOString(),
  };
}

export function serializeEvent(
  e: PrismaEvent & { mainContact?: PrismaMember | null },
): Event {
  return {
    id: e.id,
    name: e.name,
    date: e.date?.toISOString() ?? "",
    venue: e.venue ?? undefined,
    estimated_attendance: e.estimatedAttendance ?? undefined,
    description: e.description ?? undefined,
    status: e.status,
    collab_clubs:
      e.collaboratingClubs.length > 0 ? e.collaboratingClubs : undefined,
    main_contact_id: e.mainContactId ?? undefined,
    created_at: e.createdAt.toISOString(),
    updated_at: e.updatedAt.toISOString(),
  };
}

export function serializeTask(
  t: PrismaTask & { assignee?: PrismaMember | null },
): Task {
  return {
    id: t.id,
    event_id: t.eventId,
    title: t.text,
    category: CATEGORY_LABELS[t.category] ?? t.category,
    status: t.status,
    assignee_id: t.assigneeId ?? undefined,
    assignee: t.assignee ? serializeMember(t.assignee) : undefined,
    deadline: t.deadline?.toISOString() ?? undefined,
    notes: t.notes ?? undefined,
    completed_at: t.completedAt?.toISOString() ?? undefined,
    created_at: t.createdAt.toISOString(),
  };
}

export function serializeEopItem(e: PrismaEopItem): EOPItem {
  return {
    id: e.id,
    event_id: e.eventId,
    item_key: e.itemKey,
    label: e.label,
    is_required: e.isRequired,
    is_completed: e.isCompleted,
    file_url: e.fileUrl ?? undefined,
    uploaded_by: e.completedBy ?? undefined,
    uploaded_at: e.completedAt?.toISOString() ?? undefined,
  };
}

export function serializeEventFile(
  f: PrismaEventFile & { uploader?: PrismaMember | null },
): EventFile {
  return {
    id: f.id,
    event_id: f.eventId,
    file_name: f.fileName,
    file_url: f.fileUrl,
    category: f.category ?? "General",
    uploaded_by_id: f.uploadedBy,
    uploaded_by: f.uploader ? serializeMember(f.uploader) : undefined,
    uploaded_at: f.createdAt.toISOString(),
    file_size_bytes: f.fileSize ?? undefined,
  };
}

export function categoryLabel(cat: TaskCategory): string {
  return CATEGORY_LABELS[cat] ?? cat;
}
