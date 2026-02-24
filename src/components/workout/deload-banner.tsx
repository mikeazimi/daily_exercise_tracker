"use client";

import { useState } from "react";
import type { DeloadInfo } from "@/hooks/use-deload";

interface DeloadBannerProps {
  deload: DeloadInfo;
}

export function DeloadBanner({ deload }: DeloadBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!deload.isDeloadWeek || dismissed) return null;

  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-yellow-500">Deload Week</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {deload.consecutiveWeeks} weeks of training. Reduce intensity by 40% to recover.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground text-xs shrink-0"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
}
