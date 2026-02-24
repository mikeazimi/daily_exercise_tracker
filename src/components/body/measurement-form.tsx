"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface MeasurementFormProps {
  initialWeight?: number | null;
  initialBodyFat?: number | null;
  saving: boolean;
  onSave: (weightLbs: number | null, bodyFatPct: number | null) => void;
}

export function MeasurementForm({ initialWeight, initialBodyFat, saving, onSave }: MeasurementFormProps) {
  const [weight, setWeight] = useState(initialWeight?.toString() || "");
  const [bodyFat, setBodyFat] = useState(initialBodyFat?.toString() || "");

  function handleSave() {
    const w = weight ? parseFloat(weight) : null;
    const bf = bodyFat ? parseFloat(bodyFat) : null;
    if (w === null && bf === null) return;
    onSave(w, bf);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-muted-foreground block mb-1">Weight (lbs)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="185.0"
            className="w-full h-9 px-3 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-[11px] text-muted-foreground block mb-1">Body Fat %</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="15.0"
            className="w-full h-9 px-3 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving || (!weight && !bodyFat)}
        className={cn(
          "w-full py-2 text-xs font-medium rounded-md transition-colors",
          weight || bodyFat
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
