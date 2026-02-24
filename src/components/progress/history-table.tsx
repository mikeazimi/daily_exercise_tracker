"use client";

import { format, parseISO } from "date-fns";
import type { SessionSummary } from "@/hooks/use-progress-data";
import { cn } from "@/lib/utils";

interface HistoryTableProps {
  sessions: SessionSummary[];
}

export function HistoryTable({ sessions }: HistoryTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Workout History</h3>
        <p className="text-xs text-muted-foreground py-8 text-center">
          No workouts logged yet. Start your first workout to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Workout History</h3>
      <div className="space-y-1.5">
        {sessions.map((session) => {
          const isComplete = session.completedAt != null;
          const pct = session.exerciseCount > 0
            ? Math.round((session.completedExercises / session.exerciseCount) * 100)
            : 0;

          return (
            <div
              key={session.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              {/* Status dot */}
              <div
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  isComplete ? "bg-success" : "bg-primary/60"
                )}
              />

              {/* Date & type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">
                    Workout {session.workoutType}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {format(parseISO(session.date), "MMM d, yyyy")}
                  </span>
                </div>
                {session.notes && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {session.notes}
                  </p>
                )}
              </div>

              {/* Completion */}
              <div className="text-right shrink-0">
                <span className={cn(
                  "text-xs font-medium",
                  isComplete ? "text-success" : "text-muted-foreground"
                )}>
                  {session.completedExercises}/{session.exerciseCount}
                </span>
                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden mt-1">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isComplete ? "bg-success" : "bg-primary/60"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
