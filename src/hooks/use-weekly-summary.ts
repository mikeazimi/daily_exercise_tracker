"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { startOfISOWeek, endOfISOWeek, format } from "date-fns";

export interface WeeklySummaryData {
  workoutsCompleted: number;
  workoutsTotal: number;
  avgCalories: number | null;
  avgProtein: number | null;
  whoopAvgRecovery: number | null;
  weightChange: number | null;
}

export function useWeeklySummary() {
  const supabase = createClient();
  const { user } = useAuth();
  const [data, setData] = useState<WeeklySummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) { setLoading(false); return; }

      const weekStart = format(startOfISOWeek(new Date()), "yyyy-MM-dd");
      const weekEnd = format(endOfISOWeek(new Date()), "yyyy-MM-dd");

      // Workout count
      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("id, completed_at")
        .eq("user_id", user.id)
        .gte("date", weekStart)
        .lte("date", weekEnd);

      const workoutsCompleted = (sessions || []).filter((s: Record<string, unknown>) => s.completed_at).length;

      // Nutrition avg
      const { data: nutritionLogs } = await supabase
        .from("nutrition_logs")
        .select("calories, protein_g")
        .eq("user_id", user.id)
        .gte("date", weekStart)
        .lte("date", weekEnd);

      let avgCalories: number | null = null;
      let avgProtein: number | null = null;
      if (nutritionLogs && nutritionLogs.length > 0) {
        const cals = nutritionLogs.filter((n: Record<string, unknown>) => n.calories).map((n: Record<string, unknown>) => Number(n.calories));
        const prots = nutritionLogs.filter((n: Record<string, unknown>) => n.protein_g).map((n: Record<string, unknown>) => Number(n.protein_g));
        if (cals.length > 0) avgCalories = Math.round(cals.reduce((a: number, b: number) => a + b, 0) / cals.length);
        if (prots.length > 0) avgProtein = Math.round(prots.reduce((a: number, b: number) => a + b, 0) / prots.length);
      }

      // Whoop avg recovery
      const { data: whoopLogs } = await supabase
        .from("whoop_data")
        .select("recovery_score")
        .eq("user_id", user.id)
        .gte("date", weekStart)
        .lte("date", weekEnd);

      let whoopAvgRecovery: number | null = null;
      if (whoopLogs && whoopLogs.length > 0) {
        const scores = whoopLogs.filter((w: Record<string, unknown>) => w.recovery_score).map((w: Record<string, unknown>) => Number(w.recovery_score));
        if (scores.length > 0) whoopAvgRecovery = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
      }

      // Weight change vs last week
      const { data: measurements } = await supabase
        .from("body_measurements")
        .select("weight_lbs, date")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(2);

      let weightChange: number | null = null;
      if (measurements && measurements.length >= 2) {
        const latest = Number(measurements[0].weight_lbs);
        const prev = Number(measurements[1].weight_lbs);
        if (latest && prev) weightChange = Math.round((latest - prev) * 10) / 10;
      }

      setData({
        workoutsCompleted,
        workoutsTotal: 6,
        avgCalories,
        avgProtein,
        whoopAvgRecovery,
        weightChange,
      });
      setLoading(false);
    }
    load();
  }, [user]);

  return { data, loading };
}
