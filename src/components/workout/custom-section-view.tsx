"use client";

import { useState } from "react";
import type { WorkoutSection } from "@/hooks/use-user-program";
import type { ExerciseLogEntry } from "@/hooks/use-custom-workout-session";
import type { ExerciseLog } from "@/hooks/use-workout-session";
import type { ExerciseDefinition } from "@/lib/data/exercises";
import { getCatalogExercise, getExerciseVideoUrl, type CatalogExercise } from "@/lib/data/exercise-catalog";
import { ExerciseCard } from "./exercise-card";
import { X3ExerciseCard } from "./x3-exercise-card";
import { WeightExerciseCard } from "./weight-exercise-card";
import { cn } from "@/lib/utils";

interface CustomSectionViewProps {
  section: WorkoutSection;
  sectionIndex: number;
  logs: Map<string, ExerciseLogEntry>;
  sessionActive: boolean;
  onToggle: (exerciseId: string) => void;
  onUpdateX3: (exerciseId: string, bandId: string, fullReps: number, partialReps: number) => void;
  onLogSet: (exerciseId: string, setNumber: number, weightLbs: number, reps: number) => void;
  onAddSet: (exerciseId: string) => void;
  onExerciseLogged?: () => void;
}

/**
 * Adapts a CatalogExercise into the shape ExerciseCard / X3ExerciseCard expect.
 * Both of those components import ExerciseDefinition which has fields like
 * isX3, isTimed, workoutType, phase, etc. We fill in reasonable defaults for
 * fields that exist only in the legacy type.
 */
function catalogToDefinition(catalog: CatalogExercise): ExerciseDefinition {
  return {
    id: catalog.id,
    name: catalog.name,
    description: catalog.description,
    defaultReps: catalog.defaultReps,
    isX3: catalog.trackingType === "x3",
    isTimed: catalog.trackingType === "timed",
    videoUrl: getExerciseVideoUrl(catalog),
    // Legacy-only fields filled with safe defaults
    workoutType: "A",
    phase: 1,
    phaseName: "",
    phaseTimeRange: "",
    orderIndex: 0,
  };
}

/**
 * Adapts ExerciseLogEntry (from custom session) to ExerciseLog (legacy session)
 * for compatibility with X3ExerciseCard.
 */
function logEntryToLegacy(entry: ExerciseLogEntry): ExerciseLog {
  return {
    exerciseId: entry.exerciseId,
    completed: entry.completed,
    bandId: entry.bandId,
    fullReps: entry.fullReps,
    partialReps: entry.partialReps,
    estimatedForceLbs: entry.estimatedForceLbs,
  };
}

export function CustomSectionView({
  section,
  sectionIndex,
  logs,
  sessionActive,
  onToggle,
  onUpdateX3,
  onLogSet,
  onAddSet,
  onExerciseLogged,
}: CustomSectionViewProps) {
  const [collapsed, setCollapsed] = useState(false);

  const completedInSection = section.exercises.filter(
    (ex) => logs.get(ex.catalogId)?.completed
  ).length;
  const allComplete =
    completedInSection === section.exercises.length && section.exercises.length > 0;

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
            {sectionIndex + 1}
          </div>
          <div className="text-left">
            <h2 className="text-sm font-semibold">{section.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {completedInSection}/{section.exercises.length}
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
          {section.exercises.map((programExercise) => {
            const catalog = getCatalogExercise(programExercise.catalogId);
            if (!catalog) return null;

            const log = logs.get(programExercise.catalogId);
            const trackingType = catalog.trackingType;

            if (trackingType === "x3") {
              const def = catalogToDefinition(catalog);
              const legacyLog = log ? logEntryToLegacy(log) : undefined;

              return (
                <X3ExerciseCard
                  key={programExercise.catalogId}
                  exercise={def}
                  log={legacyLog}
                  disabled={!sessionActive}
                  onUpdate={(bandId, fullReps, partialReps) => {
                    onUpdateX3(programExercise.catalogId, bandId, fullReps, partialReps);
                    onExerciseLogged?.();
                  }}
                />
              );
            }

            if (trackingType === "reps_weight") {
              return (
                <WeightExerciseCard
                  key={programExercise.catalogId}
                  exercise={catalog}
                  programExercise={programExercise}
                  log={log}
                  disabled={!sessionActive}
                  onLogSet={(setNumber, weightLbs, reps) => {
                    onLogSet(programExercise.catalogId, setNumber, weightLbs, reps);
                    onExerciseLogged?.();
                  }}
                  onAddSet={() => onAddSet(programExercise.catalogId)}
                />
              );
            }

            // reps_only or timed
            const def = catalogToDefinition(catalog);
            return (
              <ExerciseCard
                key={programExercise.catalogId}
                exercise={def}
                completed={log?.completed || false}
                disabled={!sessionActive}
                onToggle={() => {
                  const wasCompleted = log?.completed;
                  onToggle(programExercise.catalogId);
                  if (!wasCompleted) onExerciseLogged?.();
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
