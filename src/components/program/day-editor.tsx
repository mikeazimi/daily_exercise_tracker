"use client";

import type { WorkoutDay, WorkoutSection } from "@/lib/data/program-templates";
import { SectionEditor } from "./section-editor";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DayEditorProps {
  day: "rest" | WorkoutDay;
  onChange: (day: "rest" | WorkoutDay) => void;
  dayIndex: number;
}

export function DayEditor({ day, onChange, dayIndex }: DayEditorProps) {
  const isRest = day === "rest";
  const dayName = DAY_NAMES[dayIndex] || `Day ${dayIndex}`;

  function handleToggle() {
    if (isRest) {
      onChange({
        name: "Workout",
        sections: [{ name: "Main", exercises: [] }],
      });
    } else {
      onChange("rest");
    }
  }

  function handleNameChange(name: string) {
    if (isRest) return;
    onChange({ ...day, name });
  }

  function handleSectionChange(index: number, section: WorkoutSection) {
    if (isRest) return;
    const sections = [...day.sections];
    sections[index] = section;
    onChange({ ...day, sections });
  }

  function handleRemoveSection(index: number) {
    if (isRest) return;
    const sections = day.sections.filter((_, i) => i !== index);
    onChange({ ...day, sections });
  }

  function handleAddSection() {
    if (isRest) return;
    onChange({
      ...day,
      sections: [...day.sections, { name: "New Section", exercises: [] }],
    });
  }

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">{dayName}</h3>
        <button
          onClick={handleToggle}
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors",
            isRest ? "bg-muted" : "bg-primary"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
              !isRest && "translate-x-5"
            )}
          />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {isRest ? "Rest Day" : "Workout Day"}
      </p>

      {/* Workout content */}
      {!isRest && (
        <div className="space-y-4">
          {/* Workout name */}
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">
              Workout Name
            </label>
            <input
              type="text"
              value={day.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Push Day"
              className="w-full h-9 px-3 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {day.sections.map((section, index) => (
              <SectionEditor
                key={index}
                section={section}
                onChange={(updated) => handleSectionChange(index, updated)}
                onRemove={() => handleRemoveSection(index)}
              />
            ))}
          </div>

          {/* Add Section */}
          <button
            onClick={handleAddSection}
            className="w-full py-2 text-xs font-medium rounded-md border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            + Add Section
          </button>
        </div>
      )}
    </div>
  );
}
