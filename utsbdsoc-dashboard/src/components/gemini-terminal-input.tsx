"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";

interface GeminiTerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isExecuting: boolean;
  placeholder?: string;
}

export function GeminiTerminalInput({
  value,
  onChange,
  onSubmit,
  isExecuting,
  placeholder = "Enter your prompt here... (e.g., 'Plan our Pohela Boishakh event')"
}: GeminiTerminalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-4">
      <div className="flex items-start gap-3">
        {/* Prompt Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gemini-gold)]/20 to-[var(--gemini-crimson)]/20 flex items-center justify-center border border-[var(--gemini-gold)]/30">
          <Sparkles className="w-5 h-5 text-[var(--gemini-gold)]" />
        </div>

        {/* Input Area */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isExecuting}
            rows={1}
            className="w-full bg-transparent text-[var(--gemini-text-primary)] placeholder:text-[var(--gemini-text-muted)] resize-none focus:outline-none text-sm leading-relaxed font-mono terminal-text-glow"
          />
          <p className="text-[10px] text-[var(--gemini-text-muted)] mt-2">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--gemini-glass-bg)] border border-[var(--gemini-glass-border)] font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[var(--gemini-glass-bg)] border border-[var(--gemini-glass-border)] font-mono">Enter</kbd> to execute
          </p>
        </div>

        {/* Execute Button */}
        <button
          onClick={onSubmit}
          disabled={isExecuting || !value.trim()}
          className="btn-execute shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl disabled:opacity-50"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Execute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
