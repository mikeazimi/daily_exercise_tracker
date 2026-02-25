"use client";

import { useState, useEffect } from "react";
import { getExerciseVideoUrl, type CatalogExercise } from "@/lib/data/exercise-catalog";
import type { ProgramExercise } from "@/hooks/use-user-program";
import type { ExerciseLogEntry } from "@/hooks/use-custom-workout-session";
import { cn } from "@/lib/utils";

interface WeightExerciseCardProps {
  exercise: CatalogExercise;
  programExercise: ProgramExercise;
  log: ExerciseLogEntry | undefined;
  disabled: boolean;
  onLogSet: (setNumber: number, weightLbs: number, reps: number) => void;
  onAddSet: () => void;
}

interface LocalSetState {
  weightLbs: string;
  reps: string;
}

export function WeightExerciseCard({
  exercise,
  programExercise,
  log,
  disabled,
  onLogSet,
  onAddSet,
}: WeightExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Build the set list from log or from programExercise target
  const sets = log?.sets ?? Array.from({ length: programExercise.targetSets }, (_, i) => ({
    setNumber: i + 1,
    reps: null as number | null,
    weightLbs: null as number | null,
    completed: false,
  }));

  // Local state for weight/reps inputs per set
  const [localSets, setLocalSets] = useState<Map<number, LocalSetState>>(new Map());

  // Initialize local state from log when it changes
  useEffect(() => {
    if (!log?.sets) return;
    const next = new Map<number, LocalSetState>();
    for (const s of log.sets) {
      next.set(s.setNumber, {
        weightLbs: s.weightLbs != null ? String(s.weightLbs) : "",
        reps: s.reps != null ? String(s.reps) : "",
      });
    }
    setLocalSets(next);
  }, [log?.sets]);

  function getLocalSet(setNumber: number): LocalSetState {
    return localSets.get(setNumber) ?? { weightLbs: "", reps: "" };
  }

  function updateLocalSet(setNumber: number, field: "weightLbs" | "reps", value: string) {
    setLocalSets((prev) => {
      const next = new Map(prev);
      const current = next.get(setNumber) ?? { weightLbs: "", reps: "" };
      next.set(setNumber, { ...current, [field]: value });
      return next;
    });
  }

  function handleLogSet(setNumber: number) {
    const local = getLocalSet(setNumber);
    const weight = parseFloat(local.weightLbs);
    const reps = parseInt(local.reps, 10);
    if (isNaN(weight) || isNaN(reps) || reps <= 0) return;
    onLogSet(setNumber, weight, reps);
  }

  const completed = log?.completed ?? false;
  const completedSets = sets.filter((s) => s.completed).length;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-all",
        completed && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Completion indicator */}
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
            completed
              ? "border border-primary bg-primary text-background"
              : "border border-primary/40"
          )}
        >
          {completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header: name + target */}
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm cursor-pointer",
                completed && "text-primary"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {exercise.name}
              <span className="ml-2 text-[10px] font-normal text-primary/70 uppercase tracking-wider">
                Weight
              </span>
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {programExercise.targetSets} &times; {programExercise.targetReps}
            </span>
          </div>

          {/* Collapsible description */}
          {expanded && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {exercise.description}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-muted text-muted-foreground">
                  {exercise.equipment}
                </span>
                <span className="text-xs text-muted-foreground">
                  {exercise.primaryMuscles.join(", ")}
                </span>
              </div>
              <a
                href={getExerciseVideoUrl(exercise)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo Video
              </a>
            </div>
          )}

          {/* Set rows */}
          {!disabled && (
            <div className="mt-3 space-y-1.5">
              {sets.map((set) => {
                const local = getLocalSet(set.setNumber);
                const setCompleted = set.completed;

                return (
                  <div
                    key={set.setNumber}
                    className={cn(
                      "flex items-center gap-1.5 py-1",
                      setCompleted && "opacity-70"
                    )}
                  >
                    {/* Set number badge */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                        setCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {set.setNumber}
                    </div>

                    {/* Weight input */}
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="lbs"
                      value={local.weightLbs}
                      onChange={(e) => updateLocalSet(set.setNumber, "weightLbs", e.target.value)}
                      disabled={setCompleted}
                      className="w-16 h-7 text-center text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <span className="text-xs text-muted-foreground shrink-0">lbs</span>

                    <span className="text-xs text-muted-foreground shrink-0">&times;</span>

                    {/* Reps input */}
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="reps"
                      value={local.reps}
                      onChange={(e) => updateLocalSet(set.setNumber, "reps", e.target.value)}
                      disabled={setCompleted}
                      className="w-14 h-7 text-center text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <span className="text-xs text-muted-foreground shrink-0">reps</span>

                    {/* Checkmark button */}
                    <button
                      onClick={() => handleLogSet(set.setNumber)}
                      disabled={setCompleted}
                      className={cn(
                        "ml-auto w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        setCompleted
                          ? "bg-primary text-background"
                          : "border border-border hover:border-primary hover:bg-primary/10"
                      )}
                    >
                      {setCompleted ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Add Set button */}
              <button
                onClick={onAddSet}
                className="mt-1 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Set
              </button>
            </div>
          )}

          {/* Completed summary (when session not active) */}
          {disabled && completed && (
            <div className="mt-2 space-y-0.5">
              {sets.filter((s) => s.completed).map((s) => (
                <div key={s.setNumber} className="text-xs text-muted-foreground">
                  Set {s.setNumber}: {s.weightLbs} lbs &times; {s.reps} reps
                </div>
              ))}
            </div>
          )}

          {/* Partial completion indicator when disabled but not fully complete */}
          {disabled && !completed && completedSets > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {completedSets}/{sets.length} sets completed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
