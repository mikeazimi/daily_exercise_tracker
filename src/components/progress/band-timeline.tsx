"use client";

import { X3_BANDS } from "@/lib/data/bands";
import type { ExerciseHistoryEntry } from "@/hooks/use-exercise-history";

interface BandTimelineProps {
  history: ExerciseHistoryEntry[];
}

export function BandTimeline({ history }: BandTimelineProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Band History
      </h3>
      <div className="flex gap-0.5 h-6 rounded-md overflow-hidden">
        {history.map((entry, i) => {
          const band = X3_BANDS.find((b) => b.id === entry.bandId);
          return (
            <div
              key={i}
              className="flex-1 min-w-1"
              style={{ backgroundColor: band?.colorHex || "#71717a" }}
              title={`${entry.date}: ${entry.bandName} - ${entry.fullReps} reps`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{history[0]?.date}</span>
        <span>{history[history.length - 1]?.date}</span>
      </div>
    </div>
  );
}
