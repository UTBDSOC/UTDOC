export const dynamic = "force-dynamic";

import React from "react";
import { Calendar, CheckSquare, Users, FileCheck2 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import EventCard from "@/components/dashboard/EventCard";
import OverduePanel from "@/components/dashboard/OverduePanel";
import TeamWorkloadChart from "@/components/dashboard/TeamWorkloadChart";
import FileCollectionHub from "@/components/dashboard/FileCollectionHub";
import { prisma } from "@/lib/prisma";
import {
  serializeEvent,
  serializeTask,
  serializeMember,
  serializeEventFile,
  serializeEopItem,
} from "@/lib/serializers";

export default async function DashboardPage() {
  const [events, tasks, members, files, eopItems] = await Promise.all([
    prisma.event.findMany({
      where: { status: { not: "archived" } },
      include: { mainContact: true },
      orderBy: { date: "desc" },
    }),
    prisma.task.findMany({
      include: { assignee: true },
      orderBy: [{ deadline: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.member.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.eventFile.findMany({
      include: { uploader: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.eopItem.findMany(),
  ]);

  const serializedEvents = events.map(serializeEvent);
  const serializedTasks = tasks.map(serializeTask);
  const serializedMembers = members.map(serializeMember);
  const serializedFiles = files.map(serializeEventFile);
  const serializedEopItems = eopItems.map(serializeEopItem);

  const activeEvents = serializedEvents.filter((e) => e.status === "active");

  const overdueTasksCount = serializedTasks.filter(
    (t) =>
      t.deadline &&
      new Date(t.deadline) < new Date() &&
      t.status !== "completed",
  ).length;

  const eventNameMap = serializedEvents.reduce(
    (acc, event) => {
      acc[event.id] = event.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const getEopStats = (eventId: string) => {
    const items = serializedEopItems.filter((e) => e.event_id === eventId);
    const required = items.filter((i) => i.is_required);
    const completed = required.filter((i) => i.is_completed).length;
    return {
      total: required.length || 7,
      completed,
      status:
        completed === required.length && required.length > 0
          ? ("green" as const)
          : ("yellow" as const),
    };
  };

  const getTaskProgress = (eventId: string) => {
    const eventTasks = serializedTasks.filter((t) => t.event_id === eventId);
    if (eventTasks.length === 0) return 0;
    return Math.round(
      (eventTasks.filter((t) => t.status === "completed").length /
        eventTasks.length) *
        100,
    );
  };

  let totalReq = 0;
  let totalComp = 0;
  activeEvents.forEach((e) => {
    const stats = getEopStats(e.id);
    totalReq += stats.total;
    totalComp += stats.completed;
  });
  const eopAverage =
    totalReq === 0 ? 0 : Math.round((totalComp / totalReq) * 100);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-sans leading-tight">
            Command Centre
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            President&apos;s overview of all active operations and team
            performance.
          </p>
        </div>
      </div>

      {/* Section A: StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          label="Active Events"
          value={activeEvents.length}
          trend="neutral"
          accentColor="text-status-blue"
        />
        <StatCard
          icon={CheckSquare}
          label="Overdue Tasks"
          value={overdueTasksCount}
          trend={overdueTasksCount > 0 ? "down" : "neutral"}
          accentColor={
            overdueTasksCount > 0 ? "text-status-red" : "text-status-green"
          }
        />
        <StatCard
          icon={FileCheck2}
          label="Avg EOP Compliance"
          value={`${eopAverage}%`}
          trend="up"
          accentColor="text-status-green"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={serializedMembers.length}
          trend="up"
          accentColor="text-status-purple"
        />
      </div>

      {/* Section C: Overdue Panel */}
      <OverduePanel tasks={serializedTasks} events={eventNameMap} />

      {/* Section B: Active Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-widest border-l-2 border-accent-gold pl-3">
            Active Operations
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              taskProgress={getTaskProgress(event.id)}
              eopStatus={getEopStats(event.id)}
              overdueTaskCount={
                serializedTasks.filter(
                  (t) =>
                    t.event_id === event.id &&
                    t.deadline &&
                    new Date(t.deadline) < new Date() &&
                    t.status !== "completed",
                ).length
              }
            />
          ))}
          {activeEvents.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl text-text-secondary text-sm">
              No active events found.
            </div>
          )}
        </div>
      </div>

      {/* Sections D & E: Analytics & Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TeamWorkloadChart
            tasks={serializedTasks}
            members={serializedMembers}
          />
        </div>
        <div>
          <FileCollectionHub files={serializedFiles} events={eventNameMap} />
        </div>
      </div>
    </div>
  );
}
