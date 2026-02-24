"use client";

import { useState } from "react";
import type { ProgressPhoto } from "@/hooks/use-progress-photos";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  photos: ProgressPhoto[];
  onDelete?: (id: string) => void;
}

export function PhotoGallery({ photos, onDelete }: PhotoGalleryProps) {
  const [filter, setFilter] = useState<"all" | "front" | "side" | "back">("all");

  const filtered = filter === "all" ? photos : photos.filter((p) => p.photoType === filter);

  if (photos.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Progress Photos</h3>
        <p className="text-xs text-muted-foreground py-8 text-center">
          No photos yet. Add progress photos from the home page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Progress Photos</h3>

      <div className="flex gap-1.5">
        {(["all", "front", "side", "back"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-2 py-1 text-[11px] rounded-md border transition-all capitalize",
              filter === type
                ? "border-primary bg-primary/20 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filtered.map((photo) => (
          <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-border">
            <img
              src={photo.photoUrl}
              alt={`${photo.photoType} - ${photo.takenAt}`}
              className="w-full aspect-[3/4] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2">
              <p className="text-[10px] text-white font-medium capitalize">{photo.photoType}</p>
              <p className="text-[10px] text-white/70">{photo.takenAt}</p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(photo.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                &#x2715;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
