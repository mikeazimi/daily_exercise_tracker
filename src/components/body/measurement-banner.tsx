"use client";

import { useState } from "react";
import { MeasurementForm } from "./measurement-form";

interface MeasurementBannerProps {
  daysSinceLastMeasurement: number | null;
  saving: boolean;
  onSave: (weightLbs: number | null, bodyFatPct: number | null) => void;
}

export function MeasurementBanner({ daysSinceLastMeasurement, saving, onSave }: MeasurementBannerProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldShow = daysSinceLastMeasurement === null || daysSinceLastMeasurement >= 7;
  if (!shouldShow) return null;

  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">&#x2696;&#xFE0F;</span>
          <div>
            <p className="text-xs font-medium">Weekly Check-in</p>
            <p className="text-[10px] text-muted-foreground">
              {daysSinceLastMeasurement === null
                ? "Log your weight & body fat to get started"
                : `Last logged ${daysSinceLastMeasurement} days ago`}
            </p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-yellow-500/20">
          <MeasurementForm
            saving={saving}
            onSave={(w, bf) => {
              onSave(w, bf);
              setExpanded(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
