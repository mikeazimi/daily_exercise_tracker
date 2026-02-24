"use client";

import type { StreakData } from "@/hooks/use-streaks";

interface StreakBadgeProps {
  streak: StreakData;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak.currentStreak === 0 && streak.currentWeekCount === 0) return null;

  return (
    <div className="flex items-center justify-between text-xs">
      {streak.currentStreak > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-base">&#x1F525;</span>
          <span className="font-semibold text-primary">{streak.currentStreak} week streak</span>
        </div>
      )}
      <span className="text-muted-foreground ml-auto">
        This week: {streak.currentWeekCount}/{streak.weeklyTarget * 2}
      </span>
    </div>
  );
}
