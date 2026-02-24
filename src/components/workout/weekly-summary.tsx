"use client";

import { useState } from "react";
import type { WeeklySummaryData } from "@/hooks/use-weekly-summary";
import { cn } from "@/lib/utils";

interface WeeklySummaryProps {
  data: WeeklySummaryData | null;
  loading: boolean;
}

export function WeeklySummary({ data, loading }: WeeklySummaryProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading || !data) return null;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
            This Week
          </span>
          <span className="text-xs font-semibold text-primary">
            {data.workoutsCompleted}/{data.workoutsTotal}
          </span>
        </div>
        <svg
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-3 grid grid-cols-2 gap-3">
          {data.avgCalories != null && (
            <div>
              <p className="text-[10px] text-muted-foreground">Avg Calories</p>
              <p className="text-sm font-semibold">{data.avgCalories}</p>
            </div>
          )}
          {data.avgProtein != null && (
            <div>
              <p className="text-[10px] text-muted-foreground">Avg Protein</p>
              <p className="text-sm font-semibold">{data.avgProtein}g</p>
            </div>
          )}
          {data.whoopAvgRecovery != null && (
            <div>
              <p className="text-[10px] text-muted-foreground">Avg Recovery</p>
              <p className={cn(
                "text-sm font-semibold",
                data.whoopAvgRecovery >= 67 ? "text-emerald-500" :
                data.whoopAvgRecovery >= 34 ? "text-yellow-500" : "text-red-500"
              )}>
                {data.whoopAvgRecovery}%
              </p>
            </div>
          )}
          {data.weightChange != null && (
            <div>
              <p className="text-[10px] text-muted-foreground">Weight Trend</p>
              <p className="text-sm font-semibold">
                {data.weightChange > 0 ? "+" : ""}{data.weightChange} lbs
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
