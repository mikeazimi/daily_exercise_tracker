"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface PersonalRecord {
  exerciseId: string;
  recordType: "max_reps" | "max_force";
  bandId: string | null;
  value: number;
  achievedAt: string;
}

export interface PRResult {
  isNewPR: boolean;
  type: "max_reps" | "max_force";
  previousValue: number;
  newValue: number;
  exerciseName: string;
}

export function usePersonalRecords() {
  const supabase = createClient();
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("personal_records")
        .select("exercise_id, record_type, band_id, value, achieved_at")
        .eq("user_id", user.id);

      if (data) {
        setRecords(data.map((r: Record<string, unknown>) => ({
          exerciseId: r.exercise_id as string,
          recordType: r.record_type as "max_reps" | "max_force",
          bandId: r.band_id as string | null,
          value: Number(r.value),
          achievedAt: r.achieved_at as string,
        })));
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const checkForPR = useCallback(async (
    exerciseId: string,
    exerciseName: string,
    bandId: string,
    fullReps: number,
    estimatedForce: number,
    sessionId: string
  ): Promise<PRResult | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check max_reps for this exercise+band
    const currentMaxReps = records.find(
      (r) => r.exerciseId === exerciseId && r.recordType === "max_reps" && r.bandId === bandId
    );

    let result: PRResult | null = null;

    if (!currentMaxReps || fullReps > currentMaxReps.value) {
      await supabase.from("personal_records").insert({
        user_id: user.id,
        exercise_id: exerciseId,
        record_type: "max_reps",
        band_id: bandId,
        value: fullReps,
        session_id: sessionId,
      });

      result = {
        isNewPR: true,
        type: "max_reps",
        previousValue: currentMaxReps?.value ?? 0,
        newValue: fullReps,
        exerciseName,
      };

      setRecords((prev) => [
        ...prev.filter((r) => !(r.exerciseId === exerciseId && r.recordType === "max_reps" && r.bandId === bandId)),
        { exerciseId, recordType: "max_reps", bandId, value: fullReps, achievedAt: new Date().toISOString() },
      ]);
    }

    // Check max_force for this exercise (any band)
    const currentMaxForce = records.find(
      (r) => r.exerciseId === exerciseId && r.recordType === "max_force"
    );

    if (!currentMaxForce || estimatedForce > currentMaxForce.value) {
      await supabase.from("personal_records").insert({
        user_id: user.id,
        exercise_id: exerciseId,
        record_type: "max_force",
        band_id: bandId,
        value: estimatedForce,
        session_id: sessionId,
      });

      // Only override reps PR if force is more impressive (user sees most impactful)
      if (!result) {
        result = {
          isNewPR: true,
          type: "max_force",
          previousValue: currentMaxForce?.value ?? 0,
          newValue: estimatedForce,
          exerciseName,
        };
      }

      setRecords((prev) => [
        ...prev.filter((r) => !(r.exerciseId === exerciseId && r.recordType === "max_force")),
        { exerciseId, recordType: "max_force", bandId, value: estimatedForce, achievedAt: new Date().toISOString() },
      ]);
    }

    return result;
  }, [records, supabase]);

  const hasRepPR = useCallback((exerciseId: string, bandId: string) => {
    return records.some(
      (r) => r.exerciseId === exerciseId && r.recordType === "max_reps" && r.bandId === bandId
    );
  }, [records]);

  return { records, loading, checkForPR, hasRepPR };
}
