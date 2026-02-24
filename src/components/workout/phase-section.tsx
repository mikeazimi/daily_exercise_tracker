"use client";

import { useState } from "react";
import type { PhaseGroup } from "@/lib/data/exercises";
import type { ExerciseLog } from "@/hooks/use-workout-session";
import { ExerciseCard } from "./exercise-card";
import { X3ExerciseCard } from "./x3-exercise-card";
import { cn } from "@/lib/utils";

interface PhaseSectionProps {
  phase: PhaseGroup;
  logs: Map<string, ExerciseLog>;
  sessionActive: boolean;
  onToggle: (exerciseId: string) => void;
  onUpdateX3: (exerciseId: string, bandId: string, fullReps: number, partialReps: number) => void;
}

export function PhaseSection({ phase, logs, sessionActive, onToggle, onUpdateX3 }: PhaseSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const completedInPhase = phase.exercises.filter(
    (e) => logs.get(e.id)?.completed
  ).length;
  const allComplete = completedInPhase === phase.exercises.length && phase.exercises.length > 0;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between py-2 group"
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              allComplete
                ? "bg-success/20 text-success"
                : "bg-muted text-muted-foreground"
            )}
          >
            {phase.phase}
          </div>
          <div className="text-left">
            <h2 className="text-sm font-semibold">{phase.phaseName}</h2>
            <p className="text-[11px] text-muted-foreground">{phase.phaseTimeRange}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {completedInPhase}/{phase.exercises.length}
          </span>
          <svg
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              collapsed && "-rotate-90"
            )}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {!collapsed && (
        <div className="space-y-2 pl-2">
          {phase.exercises.map((exercise) =>
            exercise.isX3 ? (
              <X3ExerciseCard
                key={exercise.id}
                exercise={exercise}
                log={logs.get(exercise.id)}
                disabled={!sessionActive}
                onUpdate={(bandId, fullReps, partialReps) =>
                  onUpdateX3(exercise.id, bandId, fullReps, partialReps)
                }
              />
            ) : (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                completed={logs.get(exercise.id)?.completed || false}
                disabled={!sessionActive}
                onToggle={() => onToggle(exercise.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
