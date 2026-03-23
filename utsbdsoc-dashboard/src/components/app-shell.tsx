"use client";

import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      {/* Top bar */}
      <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-bg-elevated bg-bg-card/80 backdrop-blur-sm px-6">
        <div />
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-bg-elevated" />
        </div>
      </header>
      {/* Main content */}
      <main className="ml-64 pt-16 p-6">{children}</main>
    </div>
  );
}
