"use client";

import type { ProgressionRecommendation } from "@/lib/progression/analyzer";
import { cn } from "@/lib/utils";

interface ProgressionBannerProps {
  recommendations: ProgressionRecommendation[];
  onAccept: (rec: ProgressionRecommendation) => void;
  onDismiss: (rec: ProgressionRecommendation) => void;
}

export function ProgressionBanner({ recommendations, onAccept, onDismiss }: ProgressionBannerProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-2">
      {recommendations.map((rec) => (
        <div
          key={rec.exerciseId}
          className={cn(
            "rounded-lg border p-3 space-y-2",
            rec.type === "band_up"
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-yellow-500/30 bg-yellow-500/5"
          )}
        >
          <div>
            <p className="text-xs font-semibold">{rec.exerciseName}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {rec.type === "band_up" ? "Move up to" : "Consider dropping to"}{" "}
              <span className="font-semibold text-foreground">{rec.suggestedBandName}</span> band
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {rec.reason}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(rec)}
              className={cn(
                "px-3 py-1 text-[11px] font-medium rounded-md transition-colors",
                rec.type === "band_up"
                  ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                  : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
              )}
            >
              Accept
            </button>
            <button
              onClick={() => onDismiss(rec)}
              className="px-3 py-1 text-[11px] font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
