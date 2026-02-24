"use client";

import { useState } from "react";
import type { NutritionLog } from "@/hooks/use-nutrition-log";

interface MacroFormProps {
  existingLog: NutritionLog | null;
  saving: boolean;
  onSave: (calories: number | null, proteinG: number | null, carbsG: number | null, fatG: number | null) => void;
}

export function MacroForm({ existingLog, saving, onSave }: MacroFormProps) {
  const [calories, setCalories] = useState(existingLog?.calories?.toString() || "");
  const [protein, setProtein] = useState(existingLog?.proteinG?.toString() || "");
  const [carbs, setCarbs] = useState(existingLog?.carbsG?.toString() || "");
  const [fat, setFat] = useState(existingLog?.fatG?.toString() || "");

  function handleSave() {
    onSave(
      calories ? parseInt(calories) : null,
      protein ? parseFloat(protein) : null,
      carbs ? parseFloat(carbs) : null,
      fat ? parseFloat(fat) : null
    );
  }

  const hasValues = calories || protein || carbs || fat;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Calories</label>
          <input
            type="number"
            inputMode="numeric"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="2100"
            className="w-full h-8 px-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Protein (g)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="180"
            className="w-full h-8 px-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Carbs (g)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="200"
            className="w-full h-8 px-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Fat (g)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="70"
            className="w-full h-8 px-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving || !hasValues}
        className={`w-full py-2 text-xs font-medium rounded-md transition-colors ${
          hasValues
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {saving ? "Saving..." : existingLog ? "Update" : "Log Macros"}
      </button>
    </div>
  );
}
