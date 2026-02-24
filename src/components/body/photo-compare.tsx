"use client";

import { useState, useMemo } from "react";
import type { ProgressPhoto } from "@/hooks/use-progress-photos";
import { cn } from "@/lib/utils";

interface PhotoCompareProps {
  photos: ProgressPhoto[];
}

export function PhotoCompare({ photos }: PhotoCompareProps) {
  const [photoType, setPhotoType] = useState<"front" | "side" | "back">("front");

  const filtered = useMemo(
    () => photos.filter((p) => p.photoType === photoType).sort((a, b) => a.takenAt.localeCompare(b.takenAt)),
    [photos, photoType]
  );

  const dates = useMemo(() => [...new Set(filtered.map((p) => p.takenAt))], [filtered]);

  const [leftDate, setLeftDate] = useState(dates[0] || "");
  const [rightDate, setRightDate] = useState(dates[dates.length - 1] || "");

  const leftPhoto = filtered.find((p) => p.takenAt === leftDate);
  const rightPhoto = filtered.find((p) => p.takenAt === rightDate);

  if (photos.length < 2) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Compare</h3>

      <div className="flex gap-1.5">
        {(["front", "side", "back"] as const).map((type) => {
          const count = photos.filter((p) => p.photoType === type).length;
          return (
            <button
              key={type}
              onClick={() => setPhotoType(type)}
              disabled={count < 2}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-medium rounded-md border transition-colors capitalize",
                photoType === type
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30",
                count < 2 && "opacity-40 cursor-not-allowed"
              )}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {dates.length >= 2 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <select
              value={leftDate}
              onChange={(e) => setLeftDate(e.target.value)}
              className="w-full h-7 text-[11px] bg-input border border-border rounded-md px-1.5"
            >
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {leftPhoto && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={leftPhoto.photoUrl} alt="Before" className="w-full aspect-[3/4] object-cover" />
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <select
              value={rightDate}
              onChange={(e) => setRightDate(e.target.value)}
              className="w-full h-7 text-[11px] bg-input border border-border rounded-md px-1.5"
            >
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {rightPhoto && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={rightPhoto.photoUrl} alt="After" className="w-full aspect-[3/4] object-cover" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
