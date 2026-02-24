"use client";

import type { ExerciseDefinition } from "@/lib/data/exercises";
import { X3_BANDS } from "@/lib/data/bands";
import { cn } from "@/lib/utils";

interface ExerciseInfoProps {
  exercise: ExerciseDefinition;
}

export function ExerciseInfo({ exercise }: ExerciseInfoProps) {
  return (
    <div className="mt-3 space-y-3">
      {/* Type badge + default reps */}
      <div className="flex items-center gap-2 flex-wrap">
        {exercise.isX3 && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/15 text-primary">
            X3 Bar
          </span>
        )}
        {exercise.isTimed && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-blue-500/15 text-blue-400">
            Timed
          </span>
        )}
        {!exercise.isX3 && !exercise.isTimed && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-muted text-muted-foreground">
            Reps
          </span>
        )}
        <span className="text-xs font-semibold text-foreground">
          {exercise.defaultReps}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {exercise.description}
      </p>

      {/* Video demo link */}
      {exercise.videoUrl && (
        <a
          href={exercise.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Demo Video
        </a>
      )}

      {/* Band guide for X3 exercises */}
      {exercise.isX3 && (
        <div className="rounded-md border border-border/50 bg-muted/30 p-3 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Band Guide
          </p>
          <div className="space-y-1">
            {X3_BANDS.map((band) => (
              <div key={band.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full border border-border/50",
                    )}
                    style={{ backgroundColor: band.colorHex }}
                  />
                  <span className="text-muted-foreground">{band.name}</span>
                </div>
                <span className="text-muted-foreground tabular-nums">
                  {band.minResistanceLbs}–{band.maxResistanceLbs} lbs
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
