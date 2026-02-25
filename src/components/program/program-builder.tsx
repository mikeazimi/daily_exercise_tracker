"use client";

import { useState } from "react";
import type { ProgramSchedule, ProgramTemplate } from "@/lib/data/program-templates";
import { PROGRAM_TEMPLATES } from "@/lib/data/program-templates";
import { TemplatePicker } from "./template-picker";
import { WeekScheduleGrid } from "./week-schedule-grid";
import { DayEditor } from "./day-editor";
import { cn } from "@/lib/utils";

const DEFAULT_SCHEDULE: ProgramSchedule = {
  "0": "rest",
  "1": "rest",
  "2": "rest",
  "3": "rest",
  "4": "rest",
  "5": "rest",
  "6": "rest",
};

interface ProgramBuilderProps {
  initialSchedule?: ProgramSchedule;
  initialName?: string;
  saving: boolean;
  onSave: (schedule: ProgramSchedule, name: string) => void;
  onDelete?: () => void;
}

export function ProgramBuilder({
  initialSchedule,
  initialName,
  saving,
  onSave,
  onDelete,
}: ProgramBuilderProps) {
  const [schedule, setSchedule] = useState<ProgramSchedule>(
    initialSchedule || DEFAULT_SCHEDULE
  );
  const [programName, setProgramName] = useState(initialName || "My Program");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(!initialSchedule);

  function handleTemplateSelect(template: ProgramTemplate) {
    setSchedule({ ...template.schedule });
    setProgramName(template.name);
    setShowTemplates(false);
    setSelectedDay(null);
  }

  function handleDayChange(day: "rest" | import("@/lib/data/program-templates").WorkoutDay) {
    if (selectedDay === null) return;
    setSchedule((prev) => ({
      ...prev,
      [String(selectedDay)]: day,
    }));
  }

  function handleSave() {
    onSave(schedule, programName);
  }

  return (
    <div className="space-y-6">
      {/* Program name */}
      <div>
        <label className="text-[11px] text-muted-foreground block mb-1">
          Program Name
        </label>
        <input
          type="text"
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          placeholder="My Program"
          className="w-full h-9 px-3 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Template Picker */}
      {showTemplates && (
        <div className="space-y-2">
          <TemplatePicker
            templates={PROGRAM_TEMPLATES}
            onSelect={handleTemplateSelect}
          />
          <button
            onClick={() => setShowTemplates(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip, start from scratch
          </button>
        </div>
      )}

      {/* Show templates toggle when hidden */}
      {!showTemplates && (
        <button
          onClick={() => setShowTemplates(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Load from template...
        </button>
      )}

      {/* Week schedule grid */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Weekly Schedule</h2>
        <WeekScheduleGrid
          schedule={schedule}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      </div>

      {/* Day Editor */}
      {selectedDay !== null && (
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <DayEditor
            dayIndex={selectedDay}
            day={schedule[String(selectedDay)] || "rest"}
            onChange={handleDayChange}
          />
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "w-full py-2.5 text-sm font-medium rounded-lg transition-colors",
            "bg-primary text-primary-foreground hover:opacity-90",
            saving && "opacity-50 cursor-not-allowed"
          )}
        >
          {saving ? "Saving..." : "Save Program"}
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            className="w-full py-2.5 text-sm font-medium rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
          >
            Reset to Default
          </button>
        )}
      </div>
    </div>
  );
}
