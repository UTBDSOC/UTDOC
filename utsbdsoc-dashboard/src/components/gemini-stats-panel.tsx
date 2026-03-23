"use client";

import type { SessionStats } from "@/lib/gemini-types";
import { GeminiStatRing } from "./gemini-stat-ring";
import { Zap, Clock, DollarSign, Activity } from "lucide-react";

interface GeminiStatsPanelProps {
  stats: SessionStats;
}

export function GeminiStatsPanel({ stats }: GeminiStatsPanelProps) {
  return (
    <aside className="w-[300px] shrink-0 h-full overflow-y-auto gemini-scrollbar p-4 space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4">
        <h2 className="font-serif text-lg font-semibold text-[var(--gemini-text-primary)] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--gemini-gold)]" />
          Session Stats
        </h2>
        <p className="text-xs text-[var(--gemini-text-muted)] mt-1">
          Real-time usage metrics
        </p>
      </div>

      {/* Token Usage Ring */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center">
        <GeminiStatRing
          value={stats.tokensUsed}
          max={stats.tokensLimit}
          size={120}
          strokeWidth={10}
          label="Tokens Used"
          unit=" tokens"
        />
      </div>

      {/* Request Usage Ring */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center">
        <GeminiStatRing
          value={stats.requestsToday}
          max={stats.requestsLimit}
          size={100}
          strokeWidth={8}
          label="Daily Requests"
        />
      </div>

      {/* Quick Stats */}
      <div className="glass-panel rounded-2xl p-4 space-y-4">
        {/* Latency */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--gemini-terminal-glow)]/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[var(--gemini-terminal-glow)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--gemini-text-muted)]">Avg Latency</p>
              <p className="text-sm font-medium text-[var(--gemini-text-primary)]">
                {stats.latencyMs.toLocaleString()}ms
              </p>
            </div>
          </div>
          <div className="px-2 py-1 rounded-full bg-[var(--gemini-terminal-glow)]/10 text-[var(--gemini-terminal-glow)] text-xs font-medium">
            {stats.latencyMs < 1000 ? "Fast" : stats.latencyMs < 2000 ? "Good" : "Slow"}
          </div>
        </div>

        {/* Cost */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--gemini-gold)]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[var(--gemini-gold)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--gemini-text-muted)]">Session Cost</p>
              <p className="text-sm font-medium text-[var(--gemini-text-primary)]">
                ${stats.costUsd.toFixed(3)}
              </p>
            </div>
          </div>
          <div className="px-2 py-1 rounded-full bg-[var(--gemini-gold)]/10 text-[var(--gemini-gold)] text-xs font-medium">
            Budget OK
          </div>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--gemini-crimson)]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--gemini-crimson)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--gemini-text-muted)]">Token Rate</p>
              <p className="text-sm font-medium text-[var(--gemini-text-primary)]">
                ~{Math.round(stats.tokensUsed / stats.requestsToday)} /req
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Stats */}
      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-xs uppercase tracking-wider text-[var(--gemini-text-muted)] mb-3">
          Event Planning Progress
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--gemini-text-secondary)]">Prompts Generated</span>
              <span className="text-[var(--gemini-text-primary)] font-medium">24</span>
            </div>
            <div className="h-1.5 bg-[var(--gemini-glass-border)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[var(--gemini-gold)] to-[var(--gemini-crimson)]"
                style={{ width: '80%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--gemini-text-secondary)]">Tasks Assisted</span>
              <span className="text-[var(--gemini-text-primary)] font-medium">12</span>
            </div>
            <div className="h-1.5 bg-[var(--gemini-glass-border)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[var(--gemini-gold)] to-[var(--gemini-crimson)]"
                style={{ width: '60%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
