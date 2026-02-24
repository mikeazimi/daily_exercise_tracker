"use client";

import { useState } from "react";
import type { NutritionLog } from "@/hooks/use-nutrition-log";
import { MacroForm } from "./macro-form";

interface MacroSummaryProps {
  log: NutritionLog | null;
  loading: boolean;
  saving: boolean;
  onSave: (calories: number | null, proteinG: number | null, carbsG: number | null, fatG: number | null) => void;
  targets?: { calories: number; proteinG: number; carbsG: number; fatG: number } | null;
}

function getComplianceColor(actual: number | null, target: number): string {
  if (actual === null || target === 0) return "text-muted-foreground";
  const pctOff = Math.abs(actual - target) / target;
  if (pctOff <= 0.10) return "text-emerald-500";
  if (pctOff <= 0.20) return "text-yellow-500";
  return "text-red-500";
}

export function MacroSummary({ log, loading, saving, onSave, targets }: MacroSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) return null;

  const hasLog = log && (log.calories || log.proteinG || log.carbsG || log.fatG);

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nutrition</p>
          <svg
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {hasLog ? (
          <div className="flex gap-3 mt-1.5">
            <MacroValue label="Cal" value={log.calories} target={targets?.calories} />
            <MacroValue label="P" value={log.proteinG} unit="g" target={targets?.proteinG} />
            <MacroValue label="C" value={log.carbsG} unit="g" target={targets?.carbsG} />
            <MacroValue label="F" value={log.fatG} unit="g" target={targets?.fatG} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">Tap to log today&apos;s nutrition</p>
        )}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border">
          <MacroForm existingLog={log} saving={saving} onSave={onSave} />
        </div>
      )}
    </div>
  );
}

function MacroValue({ label, value, unit, target }: {
  label: string;
  value: number | null;
  unit?: string;
  target?: number;
}) {
  const colorClass = target ? getComplianceColor(value, target) : "text-foreground";

  return (
    <div className="text-xs">
      <span className="text-muted-foreground">{label} </span>
      <span className={`font-semibold ${colorClass}`}>
        {value ?? "–"}{unit}
      </span>
      {target != null && (
        <span className="text-muted-foreground text-[10px]">/{target}</span>
      )}
    </div>
  );
}
