"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useProgressData } from "./use-progress-data";
import { analyzeAllExercises, type ProgressionRecommendation } from "@/lib/progression/analyzer";

export function useProgression() {
  const supabase = createClient();
  const { x3Progress, loading: progressLoading } = useProgressData();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load dismissed recommendations
  useEffect(() => {
    async function loadDismissed() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("progression_events")
        .select("exercise_id, event_type")
        .eq("user_id", user.id)
        .eq("event_type", "dismissed")
        .order("created_at", { ascending: false });

      if (data) {
        setDismissedIds(new Set(data.map((d: Record<string, unknown>) => d.exercise_id as string)));
      }
      setLoading(false);
    }
    loadDismissed();
  }, [supabase]);

  const allRecommendations = useMemo(() => {
    if (progressLoading) return [];
    return analyzeAllExercises(x3Progress);
  }, [x3Progress, progressLoading]);

  const recommendations = allRecommendations.filter(
    (r) => !dismissedIds.has(r.exerciseId)
  );

  const acceptRecommendation = useCallback(async (rec: ProgressionRecommendation) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("progression_events").insert({
      user_id: user.id,
      exercise_id: rec.exerciseId,
      event_type: rec.type,
      from_band_id: rec.currentBandId,
      to_band_id: rec.suggestedBandId,
      reason: rec.reason,
    });
  }, [supabase]);

  const dismissRecommendation = useCallback(async (rec: ProgressionRecommendation) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("progression_events").insert({
      user_id: user.id,
      exercise_id: rec.exerciseId,
      event_type: "dismissed",
      from_band_id: rec.currentBandId,
      to_band_id: rec.suggestedBandId,
      reason: rec.reason,
    });

    setDismissedIds((prev) => new Set([...prev, rec.exerciseId]));
  }, [supabase]);

  return {
    recommendations,
    loading: loading || progressLoading,
    acceptRecommendation,
    dismissRecommendation,
  };
}
