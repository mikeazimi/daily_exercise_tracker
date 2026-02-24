"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ExerciseHistoryEntry {
  date: string;
  bandId: string;
  bandName: string;
  bandColor: string;
  fullReps: number;
  partialReps: number;
  estimatedForceLbs: number;
}

export function useExerciseHistory(exerciseId: string) {
  const supabase = createClient();
  const [history, setHistory] = useState<ExerciseHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("exercise_logs")
        .select(`
          full_reps,
          partial_reps,
          estimated_force_lbs,
          band_id,
          workout_sessions!inner(date, user_id),
          x3_band_profiles(name, color)
        `)
        .eq("exercise_id", exerciseId)
        .eq("workout_sessions.user_id", user.id)
        .not("band_id", "is", null)
        .eq("completed", true)
        .order("workout_sessions(date)", { ascending: true });

      if (data) {
        setHistory(data.map((d: Record<string, unknown>) => {
          const session = d.workout_sessions as Record<string, unknown>;
          const band = d.x3_band_profiles as Record<string, unknown> | null;
          return {
            date: session.date as string,
            bandId: d.band_id as string,
            bandName: band?.name as string || "",
            bandColor: band?.color as string || "",
            fullReps: d.full_reps as number,
            partialReps: d.partial_reps as number,
            estimatedForceLbs: d.estimated_force_lbs as number,
          };
        }));
      }
      setLoading(false);
    }
    load();
  }, [exerciseId, supabase]);

  return { history, loading };
}
