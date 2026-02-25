"use client";

import { useState, useMemo } from "react";
import {
  EXERCISE_CATALOG,
  type CatalogExercise,
  type ExerciseCategory,
  type EquipmentType,
} from "@/lib/data/exercise-catalog";
import { cn } from "@/lib/utils";

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: CatalogExercise) => void;
}

const CATEGORIES: ("all" | ExerciseCategory)[] = [
  "all",
  "push",
  "pull",
  "legs",
  "core",
  "mobility",
  "cardio",
  "neck",
];

const EQUIPMENT_TYPES: ("all" | EquipmentType)[] = [
  "all",
  "bodyweight",
  "dumbbell",
  "barbell",
  "band",
  "machine",
  "cable",
  "kettlebell",
  "x3",
  "iron_neck",
];

function equipmentLabel(eq: string): string {
  const labels: Record<string, string> = {
    bodyweight: "Bodyweight",
    dumbbell: "Dumbbell",
    barbell: "Barbell",
    band: "Band",
    machine: "Machine",
    cable: "Cable",
    kettlebell: "Kettlebell",
    x3: "X3",
    iron_neck: "Iron Neck",
    all: "All",
  };
  return labels[eq] || eq;
}

export function ExercisePicker({ open, onClose, onSelect }: ExercisePickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ExerciseCategory>("all");
  const [equipment, setEquipment] = useState<"all" | EquipmentType>("all");

  const filtered = useMemo(() => {
    let results = EXERCISE_CATALOG;

    if (category !== "all") {
      results = results.filter((e) => e.category === category);
    }

    if (equipment !== "all") {
      results = results.filter((e) => e.equipment === equipment);
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      results = results.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.primaryMuscles.some((m) => m.toLowerCase().includes(lower)) ||
          e.id.toLowerCase().includes(lower)
      );
    }

    return results;
  }, [search, category, equipment]);

  function handleSelect(exercise: CatalogExercise) {
    onSelect(exercise);
    setSearch("");
    setCategory("all");
    setEquipment("all");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Add Exercise</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full h-9 px-3 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          autoFocus
        />

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-4 px-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "shrink-0 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors capitalize",
                category === cat
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              )}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Equipment chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-4 px-4 no-scrollbar">
          {EQUIPMENT_TYPES.map((eq) => (
            <button
              key={eq}
              onClick={() => setEquipment(eq)}
              className={cn(
                "shrink-0 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
                equipment === eq
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              )}
            >
              {equipmentLabel(eq)}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No exercises found
          </p>
        ) : (
          <div className="space-y-1">
            {filtered.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleSelect(exercise)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium flex-1 min-w-0 truncate">
                    {exercise.name}
                  </span>
                  <span className="shrink-0 text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {equipmentLabel(exercise.equipment)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {exercise.primaryMuscles.join(", ")}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
