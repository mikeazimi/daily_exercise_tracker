"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { getCatalogExercise } from "@/lib/data/exercise-catalog";
import { calculateEstimatedForce } from "@/lib/force-calculator";
import type { WorkoutDay, ProgramExercise } from "@/hooks/use-user-program";

// ── Types ──────────────────────────────────────────────────────────

export interface SetLog {
  setNumber: number;
  reps: number | null;
  weightLbs: number | null;
  completed: boolean;
}

export interface ExerciseLogEntry {
  exerciseId: string;
  catalogId: string;
  completed: boolean;
  // X3 tracking
  bandId?: string;
  fullReps?: number;
  partialReps?: number;
  estimatedForceLbs?: number;
  // Sets tracking (reps_weight exercises)
  sets?: SetLog[];
}

interface WorkoutSession {
  id: string;
  workoutType: string;
  workoutName: string;
  date: string;
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  programId: string | null;
}

// ── Hook ───────────────────────────────────────────────────────────

export function useCustomWorkoutSession(
  workoutDay: WorkoutDay,
  programId: string | null,
  date: Date
) {
  const supabase = createClient();
  const { user } = useAuth();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [logs, setLogs] = useState<Map<string, ExerciseLogEntry>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dateStr = date.toISOString().split("T")[0];

  // Flatten all exercises from all sections
  const allExercises: ProgramExercise[] = workoutDay.sections.flatMap(
    (s) => s.exercises
  );

  // Load existing session for this date
  useEffect(() => {
    async function loadSession() {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: existingSession } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .maybeSingle();

      if (existingSession) {
        setSession({
          id: existingSession.id,
          workoutType: existingSession.workout_type,
          workoutName: existingSession.workout_name || workoutDay.name,
          date: existingSession.date,
          startedAt: existingSession.started_at,
          completedAt: existingSession.completed_at,
          notes: existingSession.notes,
          programId: existingSession.program_id,
        });

        // Load exercise logs
        const { data: existingLogs } = await supabase
          .from("exercise_logs")
          .select("*")
          .eq("session_id", existingSession.id)
          .order("set_number", { ascending: true, nullsFirst: true });

        if (existingLogs) {
          const logMap = new Map<string, ExerciseLogEntry>();

          for (const log of existingLogs) {
            const exerciseId = log.exercise_id;
            const existing = logMap.get(exerciseId);
            const catalog = getCatalogExercise(exerciseId);
            const isWeightExercise = catalog?.trackingType === "reps_weight";

            if (isWeightExercise && log.set_number != null) {
              // Multi-set exercise: aggregate sets
              const entry = existing || {
                exerciseId,
                catalogId: exerciseId,
                completed: false,
                sets: [],
              };
              entry.sets = entry.sets || [];
              entry.sets.push({
                setNumber: log.set_number,
                reps: log.reps,
                weightLbs: log.weight_lbs,
                completed: log.completed,
              });
              // Exercise is completed when all sets are completed
              entry.completed = entry.sets.every((s) => s.completed);
              logMap.set(exerciseId, entry);
            } else if (catalog?.trackingType === "x3") {
              // X3 exercise
              logMap.set(exerciseId, {
                exerciseId,
                catalogId: exerciseId,
                completed: log.completed,
                bandId: log.band_id,
                fullReps: log.full_reps,
                partialReps: log.partial_reps,
                estimatedForceLbs: log.estimated_force_lbs,
              });
            } else {
              // Simple checkbox exercise
              logMap.set(exerciseId, {
                exerciseId,
                catalogId: exerciseId,
                completed: log.completed,
              });
            }
          }

          setLogs(logMap);
        }
      }
      setLoading(false);
    }
    loadSession();
  }, [dateStr, user, workoutDay.name]);

  // Start a new session
  const startSession = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: user.id,
        workout_type: "custom",
        workout_name: workoutDay.name,
        date: dateStr,
        program_id: programId,
      })
      .select()
      .single();

    if (data && !error) {
      setSession({
        id: data.id,
        workoutType: data.workout_type,
        workoutName: data.workout_name || workoutDay.name,
        date: data.date,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        notes: data.notes,
        programId: data.program_id,
      });

      // Create exercise_log rows for every exercise
      const logInserts: Record<string, unknown>[] = [];

      for (const ex of allExercises) {
        const catalog = getCatalogExercise(ex.catalogId);

        if (catalog?.trackingType === "reps_weight") {
          // Create one row per target set
          for (let s = 1; s <= ex.targetSets; s++) {
            logInserts.push({
              session_id: data.id,
              exercise_id: ex.catalogId,
              user_id: user.id,
              completed: false,
              set_number: s,
            });
          }
        } else {
          // Single row for X3, reps_only, timed
          logInserts.push({
            session_id: data.id,
            exercise_id: ex.catalogId,
            user_id: user.id,
            completed: false,
          });
        }
      }

      await supabase.from("exercise_logs").insert(logInserts);

      // Build initial log map
      const logMap = new Map<string, ExerciseLogEntry>();
      for (const ex of allExercises) {
        const catalog = getCatalogExercise(ex.catalogId);
        if (catalog?.trackingType === "reps_weight") {
          const sets: SetLog[] = [];
          for (let s = 1; s <= ex.targetSets; s++) {
            sets.push({
              setNumber: s,
              reps: null,
              weightLbs: null,
              completed: false,
            });
          }
          logMap.set(ex.catalogId, {
            exerciseId: ex.catalogId,
            catalogId: ex.catalogId,
            completed: false,
            sets,
          });
        } else {
          logMap.set(ex.catalogId, {
            exerciseId: ex.catalogId,
            catalogId: ex.catalogId,
            completed: false,
          });
        }
      }
      setLogs(logMap);
    }
  }, [supabase, workoutDay, dateStr, programId, allExercises, user]);

  // Toggle a simple exercise (reps_only, timed)
  const toggleExercise = useCallback(
    async (exerciseId: string) => {
      if (!session) return;
      setSaving(true);

      const current = logs.get(exerciseId);
      const newCompleted = !current?.completed;

      setLogs((prev) => {
        const next = new Map(prev);
        next.set(exerciseId, {
          ...current,
          exerciseId,
          catalogId: exerciseId,
          completed: newCompleted,
        });
        return next;
      });

      await supabase
        .from("exercise_logs")
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        })
        .eq("session_id", session.id)
        .eq("exercise_id", exerciseId);

      setSaving(false);
    },
    [session, logs, supabase]
  );

  // Log a set for a reps_weight exercise
  const logSet = useCallback(
    async (
      exerciseId: string,
      setNumber: number,
      weightLbs: number,
      reps: number
    ) => {
      if (!session) return;
      setSaving(true);

      // Update local state
      setLogs((prev) => {
        const next = new Map(prev);
        const entry = { ...next.get(exerciseId)! };
        const sets = [...(entry.sets || [])];
        const idx = sets.findIndex((s) => s.setNumber === setNumber);
        if (idx >= 0) {
          sets[idx] = { setNumber, reps, weightLbs, completed: true };
        }
        entry.sets = sets;
        entry.completed = sets.every((s) => s.completed);
        next.set(exerciseId, entry);
        return next;
      });

      // Update DB
      await supabase
        .from("exercise_logs")
        .update({
          weight_lbs: weightLbs,
          reps,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("session_id", session.id)
        .eq("exercise_id", exerciseId)
        .eq("set_number", setNumber);

      setSaving(false);
    },
    [session, supabase]
  );

  // Add an extra set beyond the target
  const addSet = useCallback(
    async (exerciseId: string) => {
      if (!session) return;
      if (!user) return;

      const entry = logs.get(exerciseId);
      const currentSets = entry?.sets || [];
      const newSetNumber = currentSets.length + 1;

      // Insert new row in DB
      await supabase.from("exercise_logs").insert({
        session_id: session.id,
        exercise_id: exerciseId,
        user_id: user.id,
        completed: false,
        set_number: newSetNumber,
      });

      // Update local state
      setLogs((prev) => {
        const next = new Map(prev);
        const e = { ...next.get(exerciseId)! };
        e.sets = [
          ...(e.sets || []),
          {
            setNumber: newSetNumber,
            reps: null,
            weightLbs: null,
            completed: false,
          },
        ];
        e.completed = false;
        next.set(exerciseId, e);
        return next;
      });
    },
    [session, logs, supabase, user]
  );

  // Log X3 exercise (same as legacy)
  const updateX3Log = useCallback(
    async (
      exerciseId: string,
      bandId: string,
      fullReps: number,
      partialReps: number
    ) => {
      if (!session) return;
      setSaving(true);

      const force = calculateEstimatedForce(bandId, fullReps, partialReps);

      setLogs((prev) => {
        const next = new Map(prev);
        next.set(exerciseId, {
          exerciseId,
          catalogId: exerciseId,
          completed: true,
          bandId,
          fullReps,
          partialReps,
          estimatedForceLbs: force?.peakForce,
        });
        return next;
      });

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
    },
    [session, supabase]
  );

  // Complete the session
  const completeSession = useCallback(async () => {
    if (!session) return;

    await supabase
      .from("workout_sessions")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", session.id);

    setSession((prev) =>
      prev ? { ...prev, completedAt: new Date().toISOString() } : null
    );
  }, [session, supabase]);

  // Update session notes
  const updateNotes = useCallback(
    async (notes: string) => {
      if (!session) return;
      setSession((prev) => (prev ? { ...prev, notes } : null));
      await supabase
        .from("workout_sessions")
        .update({ notes })
        .eq("id", session.id);
    },
    [session, supabase]
  );

  // Computed values
  const completedCount = Array.from(logs.values()).filter(
    (l) => l.completed
  ).length;
  const totalCount = allExercises.length;
  const isComplete = session?.completedAt != null;

  return {
    session,
    logs,
    loading,
    saving,
    startSession,
    toggleExercise,
    logSet,
    addSet,
    updateX3Log,
    completeSession,
    updateNotes,
    completedCount,
    totalCount,
    isComplete,
  };
}
