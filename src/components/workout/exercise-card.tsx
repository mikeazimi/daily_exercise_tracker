"use client";

import { useState } from "react";
import type { ExerciseDefinition } from "@/lib/data/exercises";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  completed: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export function ExerciseCard({ exercise, completed, disabled, onToggle }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-all",
        completed && "border-success/30 bg-success/5"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
            completed
              ? "border-success bg-success text-background"
              : "border-muted-foreground/40 hover:border-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm cursor-pointer",
                completed && "line-through text-muted-foreground"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {exercise.name}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {exercise.defaultReps}
            </span>
          </div>

          {expanded && (
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {exercise.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
