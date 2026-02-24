"use client";

import { useState, useCallback } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  format,
  isSameDay,
  isAfter,
  getDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useWeekSessions, type DayStatus } from "@/hooks/use-week-sessions";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();

  const baseDate = addWeeks(today, weekOffset);
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const sessionStatuses = useWeekSessions(baseDate);

  const goBack = useCallback(() => setWeekOffset((o) => o - 1), []);
  const goForward = useCallback(() => setWeekOffset((o) => Math.min(o + 1, 0)), []);
  const goToday = useCallback(() => {
    setWeekOffset(0);
    onDateChange(new Date());
  }, [onDateChange]);

  function getStatus(day: Date): DayStatus {
    const key = format(day, "yyyy-MM-dd");
    const dbStatus = sessionStatuses.get(key);
    if (dbStatus) return dbStatus;
    if (getDay(day) === 0) return "rest";
    return "none";
  }

  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="space-y-2">
      {/* Month/year header with nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Previous week"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={goToday}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
          {!isCurrentWeek && (
            <span className="ml-2 text-primary text-[10px] uppercase">Today</span>
          )}
        </button>

        <button
          onClick={goForward}
          disabled={isCurrentWeek}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isCurrentWeek ? "opacity-30 cursor-not-allowed" : "hover:bg-muted"
          )}
          aria-label="Next week"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Week strip */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isFuture = isAfter(day, today);
          const status = getStatus(day);
          const dayLabel = format(day, "EEEEE"); // M, T, W, etc.
          const dayNum = format(day, "d");

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={cn(
                "flex flex-col items-center py-1.5 rounded-lg transition-all relative",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isToday
                    ? "ring-1 ring-primary/50"
                    : "hover:bg-muted",
                isFuture && !isSelected && "opacity-40",
                status === "rest" && !isSelected && "opacity-50"
              )}
            >
              <span className={cn(
                "text-[10px] font-medium uppercase",
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {dayLabel}
              </span>
              <span className={cn(
                "text-sm font-semibold mt-0.5",
                isSelected ? "text-primary-foreground" : ""
              )}>
                {dayNum}
              </span>
              {/* Status dot */}
              <div className="h-1.5 mt-1">
                {status === "completed" && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-emerald-500"
                  )} />
                )}
                {status === "started" && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground/70" : "bg-primary/60"
                  )} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
