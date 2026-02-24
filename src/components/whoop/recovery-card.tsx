"use client";

import type { WhoopDayData } from "@/hooks/use-whoop-data";
import { cn } from "@/lib/utils";

interface RecoveryCardProps {
  data: WhoopDayData;
}

function recoveryColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 67) return "text-emerald-500";
  if (score >= 34) return "text-yellow-500";
  return "text-red-500";
}

export function RecoveryCard({ data }: RecoveryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Whoop Recovery
      </p>
      <div className="flex items-center gap-4">
        {/* Recovery score - large */}
        <div className="text-center">
          <p className={cn("text-2xl font-bold", recoveryColor(data.recoveryScore))}>
            {data.recoveryScore ?? "–"}
            <span className="text-xs font-normal">%</span>
          </p>
        </div>

        {/* Other metrics */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          <MetricPill label="Strain" value={data.strain?.toFixed(1)} />
          <MetricPill label="HRV" value={data.hrvMs?.toFixed(0)} unit="ms" />
          <MetricPill label="Sleep" value={data.sleepHours?.toFixed(1)} unit="hr" />
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value, unit }: { label: string; value?: string; unit?: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold">{value ?? "–"}{unit && <span className="text-[10px] text-muted-foreground">{unit}</span>}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}
