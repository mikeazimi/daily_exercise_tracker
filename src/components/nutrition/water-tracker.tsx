"use client";

import { cn } from "@/lib/utils";

interface WaterTrackerProps {
  currentOz: number;
  targetOz: number;
  onAdd: (oz: number) => void;
}

export function WaterTracker({ currentOz, targetOz, onAdd }: WaterTrackerProps) {
  const pct = targetOz > 0 ? Math.min(100, Math.round((currentOz / targetOz) * 100)) : 0;

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">&#x1F4A7;</span>
          <span className="text-xs font-medium">
            {currentOz}/{targetOz} oz
          </span>
          {pct >= 100 && (
            <span className="text-[10px] text-emerald-500 font-medium">&#x2713;</span>
          )}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onAdd(8)}
            className="px-2 py-1 text-[11px] font-medium rounded-md border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
          >
            +8oz
          </button>
          <button
            onClick={() => onAdd(16)}
            className="px-2 py-1 text-[11px] font-medium rounded-md border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
          >
            +16oz
          </button>
        </div>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            pct >= 100 ? "bg-emerald-500" : "bg-blue-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
