"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import type { ExerciseDefinition } from "@/lib/data/exercises";
import { calculateEstimatedForce } from "@/lib/force-calculator";

export interface ExerciseLog {
  exerciseId: string;
  completed: boolean;
  bandId?: string;
  fullReps?: number;
  partialReps?: number;
  estimatedForceLbs?: number;
}

interface WorkoutSession {
  id: string;
  workoutType: "A" | "B";
  date: string;
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
}

export function useWorkoutSession(workoutType: "A" | "B", exercises: ExerciseDefinition[], date: Date = new Date()) {
  const supabase = createClient();
  const { user } = useAuth();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [logs, setLogs] = useState<Map<string, ExerciseLog>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dateStr = date.toISOString().split("T")[0];

  // Load existing session for dateStr
  useEffect(() => {
    async function loadSession() {
      setLoading(true);
      if (!user) { setLoading(false); return; }

      const { data: existingSession } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .maybeSingle();

      if (existingSession) {
        setSession(existingSession);

        const { data: existingLogs } = await supabase
          .from("exercise_logs")
          .select("*")
          .eq("session_id", existingSession.id);

        if (existingLogs) {
          const logMap = new Map<string, ExerciseLog>();
          for (const log of existingLogs) {
            logMap.set(log.exercise_id, {
              exerciseId: log.exercise_id,
              completed: log.completed,
              bandId: log.band_id,
              fullReps: log.full_reps,
              partialReps: log.partial_reps,
              estimatedForceLbs: log.estimated_force_lbs,
            });
          }
          setLogs(logMap);
        }
      }
      setLoading(false);
    }
    loadSession();
  }, [dateStr, user]);

  const startSession = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: user.id,
        workout_type: workoutType,
        date: dateStr,
      })
      .select()
      .single();

    if (data && !error) {
      setSession(data);

      // Create empty logs for all exercises
      const logInserts = exercises.map((ex) => ({
        session_id: data.id,
        exercise_id: ex.id,
        user_id: user.id,
        completed: false,
      }));

      await supabase.from("exercise_logs").insert(logInserts);

      const logMap = new Map<string, ExerciseLog>();
      for (const ex of exercises) {
        logMap.set(ex.id, { exerciseId: ex.id, completed: false });
      }
      setLogs(logMap);
    }
  }, [supabase, workoutType, dateStr, exercises, user]);

  const toggleExercise = useCallback(async (exerciseId: string) => {
    if (!session) return;
    setSaving(true);

    const current = logs.get(exerciseId);
    const newCompleted = !current?.completed;

    const newLog: ExerciseLog = {
      ...current,
      exerciseId,
      completed: newCompleted,
    };

    setLogs((prev) => new Map(prev).set(exerciseId, newLog));

    await supabase
      .from("exercise_logs")
      .update({
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq("session_id", session.id)
      .eq("exercise_id", exerciseId);

    setSaving(false);
  }, [session, logs, supabase]);

  const updateX3Log = useCallback(async (
    exerciseId: string,
    bandId: string,
    fullReps: number,
    partialReps: number
  ) => {
    if (!session) return;
    setSaving(true);

    const force = calculateEstimatedForce(bandId, fullReps, partialReps);

    const newLog: ExerciseLog = {
      exerciseId,
      completed: true,
      bandId,
      fullReps,
      partialReps,
      estimatedForceLbs: force?.peakForce,
    };

    setLogs((prev) => new Map(prev).set(exerciseId, newLog));

    await supabase
      .from("exercise_logs")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        band_id: bandId,
        full_reps: fullReps,
        partial_reps: partialReps,
        estimated_force_lbs: force?.peakForce,
      })
      .eq("session_id", session.id)
      .eq("exercise_id", exerciseId);

    setSaving(false);
  }, [session, supabase]);

  const completeSession = useCallback(async () => {
    if (!session) return;

    await supabase
      .from("workout_sessions")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", session.id);

    setSession((prev) => prev ? { ...prev, completedAt: new Date().toISOString() } : null);
  }, [session, supabase]);

  const updateNotes = useCallback(async (notes: string) => {
    if (!session) return;
    setSession((prev) => prev ? { ...prev, notes } : null);
    await supabase
      .from("workout_sessions")
      .update({ notes })
      .eq("id", session.id);
  }, [session, supabase]);

  const completedCount = Array.from(logs.values()).filter((l) => l.completed).length;
  const totalCount = exercises.length;
  const isComplete = session?.completedAt != null;

  return {
    session,
    logs,
    loading,
    saving,
    startSession,
    toggleExercise,
    updateX3Log,
    completeSession,
    updateNotes,
    completedCount,
    totalCount,
    isComplete,
  };
}
