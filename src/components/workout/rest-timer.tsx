"use client";

import { cn } from "@/lib/utils";

interface RestTimerProps {
  remaining: number;
  isRunning: boolean;
  onSkip: () => void;
}

export function RestTimer({ remaining, isRunning, onSkip }: RestTimerProps) {
  if (!isRunning) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `${seconds}s`;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4">
      <div
        className={cn(
          "flex items-center gap-4 rounded-full border border-primary/30 bg-card/95 backdrop-blur px-5 py-2.5 shadow-lg shadow-primary/10",
          remaining <= 5 && "animate-pulse border-success/50"
        )}
      >
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Rest</span>
        <span className={cn(
          "text-lg font-bold tabular-nums min-w-[3ch] text-center",
          remaining <= 5 ? "text-success" : "text-primary"
        )}>
          {display}
        </span>
        <button
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
