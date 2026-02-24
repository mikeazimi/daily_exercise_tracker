"use client";

import { useMemo } from "react";
import { startOfISOWeek, format } from "date-fns";
import type { SessionSummary } from "@/hooks/use-progress-data";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  currentWeekCount: number;
  weeklyTarget: number;
}

export function useStreaks(sessions: SessionSummary[], weeklyTarget: number = 3): StreakData {
  return useMemo(() => {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, currentWeekCount: 0, weeklyTarget };
    }

    // Group completed sessions by ISO week key
    const weekMap = new Map<string, number>();
    for (const s of sessions) {
      if (!s.completedAt) continue;
      const weekKey = format(startOfISOWeek(new Date(s.date)), "yyyy-MM-dd");
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
    }

    // Get current week key
    const currentWeekKey = format(startOfISOWeek(new Date()), "yyyy-MM-dd");
    const currentWeekCount = weekMap.get(currentWeekKey) || 0;

    // Sort week keys descending
    const sortedWeeks = Array.from(weekMap.keys()).sort((a, b) => b.localeCompare(a));

    // Calculate current streak (walk backwards from most recent qualifying week)
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    // Get all unique ISO week keys from the data range, sorted descending
    if (sortedWeeks.length > 0) {
      const allWeeks: string[] = [];
      const firstWeek = new Date(sortedWeeks[sortedWeeks.length - 1]);
      const lastWeek = new Date(sortedWeeks[0]);
      const d = new Date(lastWeek);
      while (d >= firstWeek) {
        allWeeks.push(format(d, "yyyy-MM-dd"));
        d.setDate(d.getDate() - 7);
      }

      let foundFirst = false;
      for (const weekKey of allWeeks) {
        const count = weekMap.get(weekKey) || 0;
        if (count >= weeklyTarget) {
          streak++;
          foundFirst = true;
        } else if (weekKey === currentWeekKey) {
          // Current week gets a pass if it hasn't ended yet
          if (!foundFirst) continue;
          break;
        } else {
          longestStreak = Math.max(longestStreak, streak);
          streak = 0;
          if (foundFirst) break; // Only track from the most recent
        }
      }

      currentStreak = streak;
      longestStreak = Math.max(longestStreak, streak);
    }

    return { currentStreak, longestStreak, currentWeekCount, weeklyTarget };
  }, [sessions, weeklyTarget]);
}
