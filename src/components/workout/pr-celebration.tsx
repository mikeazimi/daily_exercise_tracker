"use client";

import { useEffect, useState } from "react";
import type { PRResult } from "@/hooks/use-personal-records";

interface PRCelebrationProps {
  result: PRResult | null;
  onDone: () => void;
}

export function PRCelebration({ result, onDone }: PRCelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result?.isNewPR) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDone();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [result, onDone]);

  if (!visible || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm animate-confetti"
            style={{
              left: `${50 + (Math.random() - 0.5) * 60}%`,
              top: "50%",
              backgroundColor: ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ef4444"][i % 6],
              animationDelay: `${Math.random() * 0.3}s`,
              animationDuration: `${1.5 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      {/* PR text */}
      <div className="relative bg-card/95 backdrop-blur border border-primary/40 rounded-xl px-6 py-4 text-center shadow-lg shadow-primary/20 animate-bounce-in">
        <p className="text-2xl mb-1">&#x1F3C6;</p>
        <p className="text-sm font-bold text-primary">New Personal Record!</p>
        <p className="text-xs text-foreground mt-1">{result.exerciseName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {result.type === "max_reps"
            ? `${result.newValue} reps (was ${result.previousValue})`
            : `${result.newValue} lbs peak (was ${result.previousValue})`}
        </p>
      </div>
    </div>
  );
}
