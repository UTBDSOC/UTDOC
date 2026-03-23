"use client";

import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/gemini-types";
import { categoryLabels, categoryEmojis } from "@/lib/gemini-mock-data";
import { Star, Clock } from "lucide-react";

interface GeminiPromptCardProps {
  prompt: Prompt;
  onClick?: (prompt: Prompt) => void;
  isActive?: boolean;
}

const categoryBadgeClass: Record<Prompt['category'], string> = {
  'event-planning': 'badge-event-planning',
  'recruitment': 'badge-recruitment',
  'gallery': 'badge-gallery',
  'general': 'badge-general',
};

export function GeminiPromptCard({ prompt, onClick, isActive }: GeminiPromptCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
  }).format(prompt.createdAt);

  return (
    <button
      onClick={() => onClick?.(prompt)}
      className={cn(
        "prompt-card w-full text-left p-4 pr-6",
        isActive && "border-[var(--gemini-gold)] bg-[var(--gemini-gold)]/5"
      )}
    >
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
          categoryBadgeClass[prompt.category]
        )}>
          <span>{categoryEmojis[prompt.category]}</span>
          {categoryLabels[prompt.category]}
        </span>
        {prompt.isFavorite && (
          <Star className="w-4 h-4 text-[var(--gemini-gold)] fill-[var(--gemini-gold)]" />
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-[var(--gemini-text-primary)] mb-1.5 line-clamp-1">
        {prompt.title}
      </h3>

      {/* Preview */}
      <p className="text-xs text-[var(--gemini-text-secondary)] line-clamp-2 mb-3">
        {prompt.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--gemini-text-muted)]">
        <Clock className="w-3 h-3" />
        <span>{formattedDate}</span>
      </div>
    </button>
  );
}
