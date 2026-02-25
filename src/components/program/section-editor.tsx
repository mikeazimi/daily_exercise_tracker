"use client";

import { useState } from "react";
import type { WorkoutSection, ProgramExercise } from "@/lib/data/program-templates";
import { getCatalogExercise } from "@/lib/data/exercise-catalog";
import type { CatalogExercise } from "@/lib/data/exercise-catalog";
import { ExercisePicker } from "./exercise-picker";
import { cn } from "@/lib/utils";

interface SectionEditorProps {
  section: WorkoutSection;
  onChange: (section: WorkoutSection) => void;
  onRemove: () => void;
}

export function SectionEditor({ section, onChange, onRemove }: SectionEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleNameChange(name: string) {
    onChange({ ...section, name });
  }

  function handleExerciseChange(index: number, updated: ProgramExercise) {
    const exercises = [...section.exercises];
    exercises[index] = updated;
    onChange({ ...section, exercises });
  }

  function handleRemoveExercise(index: number) {
    const exercises = section.exercises.filter((_, i) => i !== index);
    onChange({ ...section, exercises });
  }

  function handleMoveExercise(index: number, direction: "up" | "down") {
    const exercises = [...section.exercises];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= exercises.length) return;
    [exercises[index], exercises[targetIndex]] = [exercises[targetIndex], exercises[index]];
    onChange({ ...section, exercises });
  }

  function handleAddExercise(catalogExercise: CatalogExercise) {
    const newExercise: ProgramExercise = {
      catalogId: catalogExercise.id,
      targetSets: catalogExercise.defaultSets,
      targetReps: catalogExercise.defaultReps,
    };
    onChange({ ...section, exercises: [...section.exercises, newExercise] });
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Section Header */}
      <div className="px-4 py-3 border-b border-border">
        <input
          type="text"
          value={section.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Section name"
          className="w-full text-sm font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Exercises */}
      <div className="px-4 py-2 space-y-2">
        {section.exercises.map((exercise, index) => {
          const catalogEntry = getCatalogExercise(exercise.catalogId);
          const name = catalogEntry?.name || exercise.catalogId;

          return (
            <div
              key={`${exercise.catalogId}-${index}`}
              className="flex items-center gap-2 py-1.5"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col shrink-0">
                <button
                  onClick={() => handleMoveExercise(index, "up")}
                  disabled={index === 0}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    index === 0 && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMoveExercise(index, "down")}
                  disabled={index === section.exercises.length - 1}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    index === section.exercises.length - 1 && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>

              {/* Exercise name */}
              <span className="text-sm flex-1 min-w-0 truncate">{name}</span>

              {/* Sets input */}
              <div className="shrink-0 w-14">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={exercise.targetSets}
                  onChange={(e) =>
                    handleExerciseChange(index, {
                      ...exercise,
                      targetSets: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full h-7 px-1.5 text-xs text-center bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  title="Sets"
                />
                <p className="text-[9px] text-muted-foreground text-center mt-0.5">sets</p>
              </div>

              {/* Reps input */}
              <div className="shrink-0 w-20">
                <input
                  type="text"
                  value={exercise.targetReps}
                  onChange={(e) =>
                    handleExerciseChange(index, {
                      ...exercise,
                      targetReps: e.target.value,
                    })
                  }
                  className="w-full h-7 px-1.5 text-xs text-center bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  title="Reps"
                />
                <p className="text-[9px] text-muted-foreground text-center mt-0.5">reps</p>
              </div>

              {/* Remove button */}
              <button
                onClick={() => handleRemoveExercise(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-0.5"
                title="Remove exercise"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}

        {section.exercises.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No exercises yet
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-2">
        <button
          onClick={() => setPickerOpen(true)}
          className="flex-1 py-1.5 text-xs font-medium rounded-md border border-border text-foreground hover:bg-muted/50 transition-colors"
        >
          + Add Exercise
        </button>
        <button
          onClick={onRemove}
          className="py-1.5 px-3 text-xs font-medium rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
        >
          Remove Section
        </button>
      </div>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddExercise}
      />
    </div>
  );
}
