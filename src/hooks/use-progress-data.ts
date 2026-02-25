"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export interface SessionSummary {
  id: string;
  workoutType: "A" | "B" | "custom";
  workoutName: string | null;
  date: string;
  completedAt: string | null;
  exerciseCount: number;
  completedExercises: number;
  notes: string | null;
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
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [x3Progress, setX3Progress] = useState<X3ProgressPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      // Run all three queries in PARALLEL (instead of N+1 sequential queries)
      const [sessionsResult, logsResult, x3Result] = await Promise.all([
        // 1. Fetch all sessions
        supabase
          .from("workout_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),

        // 2. Fetch ALL exercise log counts in ONE query (instead of 2 per session)
        supabase
          .from("exercise_logs")
          .select("session_id, completed")
          .eq("user_id", user.id),

        // 3. Fetch X3 progress data
        supabase
          .from("exercise_logs")
          .select(
            `
            *,
            exercise:exercise_definitions(name),
            band:x3_band_profiles(name),
            session:workout_sessions(date)
          `
          )
          .eq("user_id", user.id)
          .not("band_id", "is", null)
          .eq("completed", true)
          .order("created_at", { ascending: true }),
      ]);

      // Count exercise totals and completions per session in JS
      const countsBySession = new Map<
        string,
        { total: number; completed: number }
      >();
      if (logsResult.data) {
        for (const log of logsResult.data) {
          const existing = countsBySession.get(log.session_id) || {
            total: 0,
            completed: 0,
          };
          existing.total++;
          if (log.completed) existing.completed++;
          countsBySession.set(log.session_id, existing);
        }
      }

      if (sessionsResult.data) {
        const summaries: SessionSummary[] = sessionsResult.data.map((s) => {
          const counts = countsBySession.get(s.id) || {
            total: 0,
            completed: 0,
          };
          return {
            id: s.id,
            workoutType: s.workout_type,
            workoutName: s.workout_name || null,
            date: s.date,
            completedAt: s.completed_at,
            exerciseCount: counts.total,
            completedExercises: counts.completed,
            notes: s.notes || null,
          };
        });
        setSessions(summaries);
      }

      if (x3Result.data) {
        const points: X3ProgressPoint[] = x3Result.data.map(
          (log: Record<string, unknown>) => ({
            date: (log.session as { date: string })?.date || "",
            exerciseName: (log.exercise as { name: string })?.name || "",
            exerciseId: log.exercise_id as string,
            bandName: (log.band as { name: string })?.name || "",
            fullReps: (log.full_reps as number) || 0,
            partialReps: (log.partial_reps as number) || 0,
            estimatedForceLbs: (log.estimated_force_lbs as number) || 0,
          })
        );
        setX3Progress(points);
      }

      setLoading(false);
    }
    load();
  }, [user]);

  return { sessions, x3Progress, loading };
}
