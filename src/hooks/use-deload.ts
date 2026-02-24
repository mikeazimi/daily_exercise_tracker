"use client";

import { useMemo } from "react";
import { startOfISOWeek, format } from "date-fns";
import type { SessionSummary } from "@/hooks/use-progress-data";

export interface DeloadInfo {
  isDeloadWeek: boolean;
  consecutiveWeeks: number;
  nextDeloadIn: number;
}

export function useDeload(sessions: SessionSummary[], deloadFrequency: number): DeloadInfo {
  return useMemo(() => {
    if (deloadFrequency <= 0) {
      return { isDeloadWeek: false, consecutiveWeeks: 0, nextDeloadIn: 0 };
    }

    // Group completed sessions by ISO week
    const weekMap = new Map<string, number>();
    for (const s of sessions) {
      if (!s.completedAt) continue;
      const weekKey = format(startOfISOWeek(new Date(s.date)), "yyyy-MM-dd");
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
    }

    // Sort weeks descending and count consecutive training weeks
    const sortedWeeks = Array.from(weekMap.keys()).sort((a, b) => b.localeCompare(a));
    if (sortedWeeks.length === 0) {
      return { isDeloadWeek: false, consecutiveWeeks: 0, nextDeloadIn: deloadFrequency };
    }

    // Walk backwards counting consecutive weeks with at least 1 workout
    let consecutiveWeeks = 0;
    const currentWeekKey = format(startOfISOWeek(new Date()), "yyyy-MM-dd");
    const checkDate = new Date(currentWeekKey);

    for (let i = 0; i < 52; i++) {
      const weekKey = format(checkDate, "yyyy-MM-dd");
      if (weekMap.has(weekKey)) {
        consecutiveWeeks++;
      } else if (i > 0) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 7);
    }

    const isDeloadWeek = consecutiveWeeks > 0 && consecutiveWeeks % deloadFrequency === 0;
    const nextDeloadIn = isDeloadWeek ? 0 : deloadFrequency - (consecutiveWeeks % deloadFrequency);

    return { isDeloadWeek, consecutiveWeeks, nextDeloadIn };
  }, [sessions, deloadFrequency]);
}
