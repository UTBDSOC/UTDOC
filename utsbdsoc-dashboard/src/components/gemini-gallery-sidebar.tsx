"use client";

import type { Prompt } from "@/lib/gemini-types";
import { GeminiPromptCard } from "./gemini-prompt-card";
import { Bookmark, Plus, Search } from "lucide-react";
import { useState } from "react";

interface GeminiGallerySidebarProps {
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
  selectedPromptId?: string;
}

export function GeminiGallerySidebar({ 
  prompts, 
  onSelectPrompt, 
  selectedPromptId 
}: GeminiGallerySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'favorites' && prompt.isFavorite);
    return matchesSearch && matchesFilter;
  });

  return (
    <aside className="w-[280px] shrink-0 h-full flex flex-col border-r border-[var(--gemini-glass-border)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--gemini-glass-border)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-[var(--gemini-text-primary)] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[var(--gemini-gold)]" />
            Gallery
          </h2>
          <button className="w-8 h-8 rounded-lg bg-[var(--gemini-gold)]/10 hover:bg-[var(--gemini-gold)]/20 flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-[var(--gemini-gold)]" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gemini-text-muted)]" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--gemini-glass-bg)] border border-[var(--gemini-glass-border)] rounded-lg text-[var(--gemini-text-primary)] placeholder:text-[var(--gemini-text-muted)] focus:outline-none focus:border-[var(--gemini-terminal-glow)] transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex mt-3 p-1 bg-[var(--gemini-glass-bg)] rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-[var(--gemini-gold)]/20 text-[var(--gemini-gold)]'
                : 'text-[var(--gemini-text-secondary)] hover:text-[var(--gemini-text-primary)]'
            }`}
          >
            All ({prompts.length})
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'favorites'
                ? 'bg-[var(--gemini-gold)]/20 text-[var(--gemini-gold)]'
                : 'text-[var(--gemini-text-secondary)] hover:text-[var(--gemini-text-primary)]'
            }`}
          >
            Favorites ({prompts.filter(p => p.isFavorite).length})
          </button>
        </div>
      </div>

      {/* Prompt List */}
      <div className="flex-1 overflow-y-auto gemini-scrollbar p-3 space-y-2">
        {filteredPrompts.map(prompt => (
          <GeminiPromptCard
            key={prompt.id}
            prompt={prompt}
            onClick={onSelectPrompt}
            isActive={selectedPromptId === prompt.id}
          />
        ))}

        {filteredPrompts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--gemini-text-muted)]">
              No prompts found
            </p>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      <div className="p-3 border-t border-[var(--gemini-glass-border)]">
        <p className="text-[10px] text-[var(--gemini-text-muted)] text-center">
          Click a prompt to load it into the terminal
        </p>
      </div>
    </aside>
  );
}
