"use client";

import type { OutputMessage } from "@/lib/gemini-types";
import { GeminiTerminalInput } from "./gemini-terminal-input";
import { GeminiTerminalOutput } from "./gemini-terminal-output";
import { Terminal } from "lucide-react";

interface GeminiMainStageProps {
  messages: OutputMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isExecuting: boolean;
}

export function GeminiMainStage({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isExecuting,
}: GeminiMainStageProps) {
  return (
    <main className="flex-1 flex flex-col min-w-0 p-4 gap-4">
      {/* Terminal Header */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--gemini-terminal-glow)]/10 flex items-center justify-center border border-[var(--gemini-terminal-glow)]/30">
            <Terminal className="w-5 h-5 text-[var(--gemini-terminal-glow)]" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-[var(--gemini-text-primary)]">
              Main Stage
            </h2>
            <p className="text-xs text-[var(--gemini-text-muted)]">
              Gemini CLI Interface
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--gemini-text-muted)]">Session Active</span>
          <div className="w-2 h-2 rounded-full bg-[var(--gemini-terminal-glow)] animate-pulse" />
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 glass-panel-elevated rounded-2xl flex flex-col overflow-hidden terminal-glow">
        <GeminiTerminalOutput messages={messages} />
      </div>

      {/* Terminal Input Area */}
      <GeminiTerminalInput
        value={inputValue}
        onChange={onInputChange}
        onSubmit={onSubmit}
        isExecuting={isExecuting}
      />
    </main>
  );
}
