"use client";

import { cn } from "@/lib/utils";

interface GeminiStatRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit?: string;
  className?: string;
}

export function GeminiStatRing({
  value,
  max,
  size = 100,
  strokeWidth = 8,
  label,
  unit = "",
  className,
}: GeminiStatRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = `gradient-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const glowId = `glow-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gemini-gold)" />
              <stop offset="100%" stopColor="var(--gemini-crimson)" />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(134, 239, 172, 0.1)"
            strokeWidth={strokeWidth}
          />

          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#${glowId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[var(--gemini-text-primary)]">
            {percentage.toFixed(0)}
          </span>
          <span className="text-xs text-[var(--gemini-text-muted)]">%</span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-[var(--gemini-text-primary)]">{label}</p>
        <p className="text-xs text-[var(--gemini-text-secondary)]">
          {value.toLocaleString()}{unit} / {max.toLocaleString()}{unit}
        </p>
      </div>
    </div>
  );
}
