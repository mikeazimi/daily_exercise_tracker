"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SessionSummary {
  id: string;
  workoutType: "A" | "B";
  date: string;
  completedAt: string | null;
  exerciseCount: number;
  completedExercises: number;
}

export interface X3ProgressPoint {
  date: string;
  exerciseName: string;
  exerciseId: string;
  bandName: string;
  fullReps: number;
  partialReps: number;
  estimatedForceLbs: number;
}

export function useProgressData() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [x3Progress, setX3Progress] = useState<X3ProgressPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch all sessions
      const { data: sessionsData } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (sessionsData) {
        // For each session, count exercises
        const summaries: SessionSummary[] = [];
        for (const s of sessionsData) {
          const { count: total } = await supabase
            .from("exercise_logs")
            .select("*", { count: "exact", head: true })
            .eq("session_id", s.id);

          const { count: completed } = await supabase
            .from("exercise_logs")
            .select("*", { count: "exact", head: true })
            .eq("session_id", s.id)
            .eq("completed", true);

          summaries.push({
            id: s.id,
            workoutType: s.workout_type,
            date: s.date,
            completedAt: s.completed_at,
            exerciseCount: total || 0,
            completedExercises: completed || 0,
          });
        }
        setSessions(summaries);
      }

      // Fetch X3 progress data
      const { data: x3Data } = await supabase
        .from("exercise_logs")
        .select(`
          *,
          exercise:exercise_definitions(name),
          band:x3_band_profiles(name),
          session:workout_sessions(date)
        `)
        .eq("user_id", user.id)
        .not("band_id", "is", null)
        .eq("completed", true)
        .order("created_at", { ascending: true });

      if (x3Data) {
        const points: X3ProgressPoint[] = x3Data.map((log: Record<string, unknown>) => ({
          date: (log.session as { date: string })?.date || "",
          exerciseName: (log.exercise as { name: string })?.name || "",
          exerciseId: log.exercise_id as string,
          bandName: (log.band as { name: string })?.name || "",
          fullReps: (log.full_reps as number) || 0,
          partialReps: (log.partial_reps as number) || 0,
          estimatedForceLbs: (log.estimated_force_lbs as number) || 0,
        }));
        setX3Progress(points);
      }

      setLoading(false);
    }
    load();
  }, [supabase]);

  return { sessions, x3Progress, loading };
}
