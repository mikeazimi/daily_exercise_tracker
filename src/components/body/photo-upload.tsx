"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  date: string;
  uploading: boolean;
  onUpload: (file: File, type: "front" | "side" | "back", date: string) => void;
}

export function PhotoUpload({ date, uploading, onUpload }: PhotoUploadProps) {
  const [photoType, setPhotoType] = useState<"front" | "side" | "back">("front");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleSubmit() {
    if (!file) return;
    onUpload(file, photoType, date);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {(["front", "side", "back"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setPhotoType(type)}
            className={cn(
              "flex-1 py-1.5 text-[11px] font-medium rounded-md border transition-colors capitalize",
              photoType === type
                ? "border-primary bg-primary/20 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {preview ? (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img src={preview} alt="Preview" className="w-full max-h-48 object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setPreview(null); setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
              className="flex-1 py-2 text-xs font-medium rounded-md border border-border text-muted-foreground hover:border-foreground/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 py-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {uploading ? "Uploading..." : "Save Photo"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-6 rounded-lg border-2 border-dashed border-border hover:border-foreground/30 transition-colors text-center"
        >
          <span className="block text-lg mb-1">&#x1F4F7;</span>
          <span className="text-xs text-muted-foreground">Tap to take or select photo</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
