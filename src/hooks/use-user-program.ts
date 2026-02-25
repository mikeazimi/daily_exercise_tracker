"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { getTodaysWorkoutType, getWorkoutLabel } from "@/lib/utils";
import { getDay } from "date-fns";

// ── Types ──────────────────────────────────────────────────────────

export interface ProgramExercise {
  catalogId: string;
  targetSets: number;
  targetReps: string;
}

export interface WorkoutSection {
  name: string;
  exercises: ProgramExercise[];
}

export interface WorkoutDay {
  name: string;
  sections: WorkoutSection[];
}

export type ProgramSchedule = Record<string, "rest" | WorkoutDay>;

export interface UserProgram {
  id: string;
  userId: string;
  name: string;
  schedule: ProgramSchedule;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodaysWorkout {
  type: "rest" | "custom" | "legacy_a" | "legacy_b";
  name: string;
  workoutDay?: WorkoutDay;
  legacyType?: "A" | "B";
}

// ── Hook ───────────────────────────────────────────────────────────

export function useUserProgram() {
  const supabase = createClient();
  const { user } = useAuth();
  const [program, setProgram] = useState<UserProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load the user's active program on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_programs")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (data) {
        setProgram({
          id: data.id,
          userId: data.user_id,
          name: data.name,
          schedule: data.schedule as ProgramSchedule,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
      setLoading(false);
    }
    load();
  }, [user]);

  // Save or create a program
  const saveProgram = useCallback(
    async (schedule: ProgramSchedule, name?: string) => {
      setSaving(true);
      if (!user) {
        setSaving(false);
        return;
      }

      if (program) {
        // Update existing program
        const { data } = await supabase
          .from("user_programs")
          .update({
            schedule,
            name: name || program.name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", program.id)
          .select()
          .single();

        if (data) {
          setProgram({
            ...program,
            schedule: data.schedule as ProgramSchedule,
            name: data.name,
            updatedAt: data.updated_at,
          });
        }
      } else {
        // Create new program
        const { data } = await supabase
          .from("user_programs")
          .insert({
            user_id: user.id,
            name: name || "My Program",
            schedule,
            is_active: true,
          })
          .select()
          .single();

        if (data) {
          setProgram({
            id: data.id,
            userId: data.user_id,
            name: data.name,
            schedule: data.schedule as ProgramSchedule,
            isActive: data.is_active,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        }
      }
      setSaving(false);
    },
    [supabase, program, user]
  );

  // Delete the custom program (reverts to default A/B)
  const deleteProgram = useCallback(async () => {
    if (!program) return;
    setSaving(true);
    await supabase.from("user_programs").delete().eq("id", program.id);
    setProgram(null);
    setSaving(false);
  }, [supabase, program]);

  // Determine today's workout for a given date
  const getTodaysWorkout = useCallback(
    (date: Date): TodaysWorkout => {
      // If no custom program, fall back to legacy A/B rotation
      if (!program) {
        const legacyType = getTodaysWorkoutType(date);
        if (legacyType === "rest") {
          return { type: "rest", name: "Rest Day" };
        }
        return {
          type: legacyType === "A" ? "legacy_a" : "legacy_b",
          name: getWorkoutLabel(legacyType),
          legacyType: legacyType,
        };
      }

      // Custom program: look up the day of the week
      const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
      const dayConfig = program.schedule[String(dayOfWeek)];

      if (!dayConfig || dayConfig === "rest") {
        return { type: "rest", name: "Rest Day" };
      }

      return {
        type: "custom",
        name: dayConfig.name,
        workoutDay: dayConfig,
      };
    },
    [program]
  );

  return {
    program,
    loading,
    saving,
    saveProgram,
    deleteProgram,
    getTodaysWorkout,
  };
}
