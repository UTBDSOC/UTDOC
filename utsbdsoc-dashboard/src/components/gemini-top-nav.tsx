"use client";

import { cn } from "@/lib/utils";
import type { ConnectionStatus, GeminiModel } from "@/lib/gemini-types";
import { Sparkles, ChevronDown, Wifi, WifiOff } from "lucide-react";

interface GeminiTopNavProps {
  connection: ConnectionStatus;
  onModelChange?: (model: GeminiModel) => void;
}

const modelLabels: Record<GeminiModel, string> = {
  'gemini-2.0-flash': 'Gemini 2.0 Flash',
  'gemini-2.0-pro': 'Gemini 2.0 Pro',
  'gemini-1.5-pro': 'Gemini 1.5 Pro',
  'gemini-1.5-flash': 'Gemini 1.5 Flash',
};

export function GeminiTopNav({ connection }: GeminiTopNavProps) {
  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gemini-gold)] to-[var(--gemini-crimson)] flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold text-[var(--gemini-text-primary)] tracking-tight">
              UTSBDSOC
            </h1>
            <p className="text-[10px] text-[var(--gemini-text-muted)] uppercase tracking-widest">
              Event Control Center
            </p>
          </div>
        </div>
      </div>

      {/* Center: Model Selector */}
      <div className="flex items-center gap-3">
        <button className="glass-panel flex items-center gap-2 px-4 py-2 rounded-full hover:border-[var(--gemini-gold)] transition-colors">
          <span className="text-sm font-medium text-[var(--gemini-text-primary)]">
            {modelLabels[connection.model]}
          </span>
          <ChevronDown className="w-4 h-4 text-[var(--gemini-text-secondary)]" />
        </button>
      </div>

      {/* Right: Connection Status & Event Timer */}
      <div className="flex items-center gap-6">
        {/* Event Countdown */}
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-[var(--gemini-text-muted)]">
            Next Event
          </p>
          <p className="font-serif text-lg text-[var(--gemini-gold)]">
            14<span className="text-[var(--gemini-text-secondary)]">d</span>{" "}
            07<span className="text-[var(--gemini-text-secondary)]">h</span>{" "}
            22<span className="text-[var(--gemini-text-secondary)]">m</span>
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[var(--gemini-glass-border)]" />

        {/* Connection Status */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "connection-dot",
              !connection.isConnected && "disconnected"
            )}
          />
          <div className="flex items-center gap-1.5">
            {connection.isConnected ? (
              <Wifi className="w-4 h-4 text-[var(--gemini-terminal-glow)]" />
            ) : (
              <WifiOff className="w-4 h-4 text-[var(--gemini-crimson)]" />
            )}
            <span className="text-sm text-[var(--gemini-text-secondary)]">
              {connection.isConnected ? "Connected" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
