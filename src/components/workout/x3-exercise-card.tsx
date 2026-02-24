"use client";

import { useState, useEffect } from "react";
import type { ExerciseDefinition } from "@/lib/data/exercises";
import { X3_BANDS, type BandProfile } from "@/lib/data/bands";
import { calculateEstimatedForce, getForceDisplay } from "@/lib/force-calculator";
import { cn } from "@/lib/utils";
import type { ExerciseLog } from "@/hooks/use-workout-session";

interface X3ExerciseCardProps {
  exercise: ExerciseDefinition;
  log: ExerciseLog | undefined;
  disabled: boolean;
  onUpdate: (bandId: string, fullReps: number, partialReps: number) => void;
}

export function X3ExerciseCard({ exercise, log, disabled, onUpdate }: X3ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [bandId, setBandId] = useState(log?.bandId || "");
  const [fullReps, setFullReps] = useState(log?.fullReps || 0);
  const [partialReps, setPartialReps] = useState(log?.partialReps || 0);

  useEffect(() => {
    if (log?.bandId) setBandId(log.bandId);
    if (log?.fullReps) setFullReps(log.fullReps);
    if (log?.partialReps) setPartialReps(log.partialReps);
  }, [log]);

  const force = bandId ? calculateEstimatedForce(bandId, fullReps, partialReps) : null;
  const selectedBand = X3_BANDS.find((b) => b.id === bandId);
  const completed = log?.completed || false;

  function handleLog() {
    if (!bandId || fullReps === 0) return;
    onUpdate(bandId, fullReps, partialReps);
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-all",
        completed && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
            completed
              ? "border border-primary bg-primary text-background"
              : "border border-primary/40"
          )}
        >
          {completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm cursor-pointer",
                completed && "text-primary"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {exercise.name}
              <span className="ml-2 text-[10px] font-normal text-primary/70 uppercase tracking-wider">
                X3
              </span>
            </h3>
            {completed && force && (
              <span className="text-xs font-semibold text-primary whitespace-nowrap">
                {force.peakForce} lbs peak
              </span>
            )}
          </div>

          {expanded && (
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {exercise.description}
            </p>
          )}

          {/* X3 input fields */}
          {!disabled && (
            <div className="mt-3 space-y-2">
              {/* Band selector */}
              <div className="flex gap-1.5 flex-wrap">
                {X3_BANDS.map((band) => (
                  <button
                    key={band.id}
                    onClick={() => setBandId(band.id)}
                    className={cn(
                      "px-2 py-1 text-[11px] rounded-md border transition-all font-medium",
                      bandId === band.id
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    )}
                  >
                    {band.name}
                  </button>
                ))}
              </div>

              {selectedBand && (
                <p className="text-[11px] text-muted-foreground">
                  {selectedBand.color} band: {getForceDisplay(selectedBand)}
                </p>
              )}

              {/* Reps inputs */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Full Reps
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFullReps(Math.max(0, fullReps - 1))}
                      className="w-7 h-7 rounded border border-border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={fullReps}
                      onChange={(e) => setFullReps(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 h-7 text-center text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={() => setFullReps(fullReps + 1)}
                      className="w-7 h-7 rounded border border-border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Partial Reps
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPartialReps(Math.max(0, partialReps - 1))}
                      className="w-7 h-7 rounded border border-border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={partialReps}
                      onChange={(e) => setPartialReps(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 h-7 text-center text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={() => setPartialReps(partialReps + 1)}
                      className="w-7 h-7 rounded border border-border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Force display + log button */}
              <div className="flex items-center justify-between pt-1">
                {force && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Est. force: </span>
                    <span className="font-semibold text-primary">{force.peakForce} lbs</span>
                    <span className="text-muted-foreground ml-2">Total work: </span>
                    <span className="font-medium">{force.totalWork.toLocaleString()}</span>
                  </div>
                )}
                <button
                  onClick={handleLog}
                  disabled={!bandId || fullReps === 0}
                  className={cn(
                    "ml-auto px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    bandId && fullReps > 0
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {completed ? "Update" : "Log Set"}
                </button>
              </div>
            </div>
          )}

          {/* Completed summary (when session not active) */}
          {disabled && completed && (
            <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
              {selectedBand && <span>{selectedBand.name} band</span>}
              {log?.fullReps != null && <span>{log.fullReps} full</span>}
              {log?.partialReps != null && <span>{log.partialReps} partial</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
