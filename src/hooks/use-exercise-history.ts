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

export interface WeightHistoryEntry {
  date: string;
  setNumber: number;
  weightLbs: number;
  reps: number;
}

export interface WeightSessionSummary {
  date: string;
  sets: { setNumber: number; weightLbs: number; reps: number }[];
  maxWeight: number;
  totalVolume: number; // sum of weight * reps across sets
}

export function useExerciseHistory(exerciseId: string) {
  const supabase = createClient();
  const [history, setHistory] = useState<ExerciseHistoryEntry[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Run both queries in parallel
      const [x3Result, weightResult] = await Promise.all([
        // X3 history (existing)
        supabase
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
          .order("workout_sessions(date)", { ascending: true }),

        // Weight exercise history (new)
        supabase
          .from("exercise_logs")
          .select(`
            set_number,
            weight_lbs,
            reps,
            workout_sessions!inner(date, user_id)
          `)
          .eq("exercise_id", exerciseId)
          .eq("workout_sessions.user_id", user.id)
          .not("set_number", "is", null)
          .not("weight_lbs", "is", null)
          .eq("completed", true)
          .order("workout_sessions(date)", { ascending: true }),
      ]);

      // Process X3 history
      if (x3Result.data) {
        setHistory(x3Result.data.map((d: Record<string, unknown>) => {
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

      // Process weight history - group by date
      if (weightResult.data && weightResult.data.length > 0) {
        const byDate = new Map<string, { setNumber: number; weightLbs: number; reps: number }[]>();

        for (const d of weightResult.data as Record<string, unknown>[]) {
          const session = d.workout_sessions as Record<string, unknown>;
          const date = session.date as string;
          const entry = {
            setNumber: d.set_number as number,
            weightLbs: d.weight_lbs as number,
            reps: d.reps as number,
          };
          const existing = byDate.get(date) || [];
          existing.push(entry);
          byDate.set(date, existing);
        }

        const summaries: WeightSessionSummary[] = [];
        for (const [date, sets] of byDate) {
          sets.sort((a, b) => a.setNumber - b.setNumber);
          const maxWeight = Math.max(...sets.map((s) => s.weightLbs));
          const totalVolume = sets.reduce((sum, s) => sum + s.weightLbs * s.reps, 0);
          summaries.push({ date, sets, maxWeight, totalVolume });
        }
        setWeightHistory(summaries);
      }

      setLoading(false);
    }
    load();
  }, [exerciseId, supabase]);

  return { history, weightHistory, loading };
}
