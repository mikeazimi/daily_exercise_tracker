"use client";

import { useMemo } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subWeeks,
  format,
  getDay,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { SessionSummary } from "@/hooks/use-progress-data";

interface CalendarHeatmapProps {
  sessions: SessionSummary[];
}

export function CalendarHeatmap({ sessions }: CalendarHeatmapProps) {
  const weeks = 20; // ~5 months of data

  const { days, sessionMap } = useMemo(() => {
    const today = new Date();
    const end = endOfWeek(today, { weekStartsOn: 0 });
    const start = startOfWeek(subWeeks(end, weeks - 1), { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start, end });

    const map = new Map<string, SessionSummary>();
    for (const s of sessions) {
      map.set(s.date, s);
    }

    return { days: allDays, sessionMap: map };
  }, [sessions]);

  // Group by weeks
  const weekGroups: Date[][] = [];
  let currentWeek: Date[] = [];
  for (const day of days) {
    if (getDay(day) === 0 && currentWeek.length > 0) {
      weekGroups.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weekGroups.push(currentWeek);

  function getCellColor(day: Date): string {
    const dateStr = format(day, "yyyy-MM-dd");
    const session = sessionMap.get(dateStr);
    const dayOfWeek = getDay(day);

    if (session?.completedAt) return "bg-success";
    if (session) return "bg-primary/60";
    if (dayOfWeek === 0) return "bg-muted/30"; // Sunday/rest
    if (day > new Date()) return "bg-transparent";
    return "bg-muted/60"; // missed
  }

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Workout Calendar</h3>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3 w-3 flex items-center justify-center text-[8px] text-muted-foreground">
              {i % 2 === 1 ? label : ""}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weekGroups.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const day = week.find((d) => getDay(d) === di);
              if (!day) return <div key={di} className="h-3 w-3" />;

              const dateStr = format(day, "yyyy-MM-dd");
              const session = sessionMap.get(dateStr);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={di}
                  title={`${format(day, "MMM d")}${session ? ` - Workout ${session.workoutType}` : ""}`}
                  className={cn(
                    "h-3 w-3 rounded-[2px] transition-colors",
                    getCellColor(day),
                    isToday && "ring-1 ring-foreground"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-muted/60" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/60" />
          <span>Started</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-success" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-muted/30" />
          <span>Rest</span>
        </div>
      </div>
    </div>
  );
}
