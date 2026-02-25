"use client";

import type { ProgramSchedule } from "@/lib/data/program-templates";
import { cn } from "@/lib/utils";

const DAY_ABBRS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface WeekScheduleGridProps {
  schedule: ProgramSchedule;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

export function WeekScheduleGrid({ schedule, selectedDay, onSelectDay }: WeekScheduleGridProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAY_ABBRS.map((abbr, index) => {
        const dayConfig = schedule[String(index)];
        const isRest = !dayConfig || dayConfig === "rest";
        const isSelected = selectedDay === index;
        const label = isRest ? "Rest" : dayConfig.name;

        return (
          <button
            key={index}
            onClick={() => onSelectDay(index)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border text-center transition-colors",
              isSelected
                ? "border-primary bg-primary/15 text-primary"
                : isRest
                  ? "border-border bg-card text-muted-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              {abbr}
            </span>
            <span
              className={cn(
                "text-[9px] leading-tight truncate w-full",
                isRest && !isSelected && "text-muted-foreground/60"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
