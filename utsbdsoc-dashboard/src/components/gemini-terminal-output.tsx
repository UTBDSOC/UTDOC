"use client";

import type { OutputMessage } from "@/lib/gemini-types";
import { User, Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GeminiTerminalOutputProps {
  messages: OutputMessage[];
}

function MessageBubble({ message }: { message: OutputMessage }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Intl.DateTimeFormat('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  return (
    <div className={cn(
      "group flex gap-3",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
        isUser 
          ? "bg-[var(--gemini-crimson)]/20 border border-[var(--gemini-crimson)]/30" 
          : "bg-gradient-to-br from-[var(--gemini-gold)]/20 to-[var(--gemini-terminal-glow)]/20 border border-[var(--gemini-gold)]/30"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-[var(--gemini-crimson)]" />
        ) : (
          <Bot className="w-4 h-4 text-[var(--gemini-gold)]" />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 min-w-0 max-w-[85%]",
        isUser && "flex flex-col items-end"
      )}>
        <div className={cn(
          "glass-panel rounded-2xl p-4",
          isUser ? "rounded-tr-md" : "rounded-tl-md"
        )}>
          {/* Message Content */}
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--gemini-text-primary)] leading-relaxed terminal-text-glow">
              {message.content}
            </pre>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--gemini-glass-border)]">
            <div className="flex items-center gap-3 text-[10px] text-[var(--gemini-text-muted)]">
              <span>{formattedTime}</span>
              {message.tokenCount && (
                <>
                  <span>•</span>
                  <span>{message.tokenCount} tokens</span>
                </>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-[var(--gemini-glass-bg)]"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--gemini-terminal-glow)]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--gemini-text-muted)]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GeminiTerminalOutput({ messages }: GeminiTerminalOutputProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gemini-gold)]/10 to-[var(--gemini-crimson)]/10 flex items-center justify-center mb-4 border border-[var(--gemini-gold)]/20">
          <Bot className="w-10 h-10 text-[var(--gemini-gold)]" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-[var(--gemini-text-primary)] mb-2">
          Ready to Assist
        </h3>
        <p className="text-sm text-[var(--gemini-text-secondary)] max-w-sm">
          Enter a prompt below to get AI-powered help with event planning, recruitment posts, gallery captions, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {['Event Planning', 'Recruitment', 'Gallery', 'General'].map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-[var(--gemini-glass-bg)] border border-[var(--gemini-glass-border)] text-[var(--gemini-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto gemini-scrollbar p-4 space-y-4">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
