"use client";

import { useState, useRef } from "react";

interface WorkoutNotesProps {
  notes: string;
  onSave: (notes: string) => void;
  disabled?: boolean;
}

export function WorkoutNotes({ notes, onSave, disabled }: WorkoutNotesProps) {
  const [value, setValue] = useState(notes);
  const savedRef = useRef(notes);

  function handleBlur() {
    if (value !== savedRef.current) {
      savedRef.current = value;
      onSave(value);
    }
  }

  if (disabled && !notes) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] text-muted-foreground uppercase tracking-wider">
        Notes
      </label>
      <textarea
        value={disabled ? notes : value}
        onChange={(e) => setValue(e.target.value.slice(0, 500))}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Form cues, injuries, equipment notes..."
        rows={2}
        className="w-full bg-card border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-muted-foreground/50"
      />
      {!disabled && (
        <p className="text-[10px] text-muted-foreground text-right">{value.length}/500</p>
      )}
    </div>
  );
}
