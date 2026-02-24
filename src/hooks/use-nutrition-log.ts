"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface NutritionLog {
  id: string;
  date: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  waterIntakeOz: number | null;
}

export function useNutritionLog(date: string) {
  const supabase = createClient();
  const [log, setLog] = useState<NutritionLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", date)
        .single();

      if (data) {
        setLog({
          id: data.id,
          date: data.date,
          calories: data.calories,
          proteinG: data.protein_g,
          carbsG: data.carbs_g,
          fatG: data.fat_g,
          waterIntakeOz: data.water_intake_oz,
        });
      } else {
        setLog(null);
      }
      setLoading(false);
    }
    load();
  }, [date, supabase]);

  const saveLog = useCallback(async (
    calories: number | null,
    proteinG: number | null,
    carbsG: number | null,
    fatG: number | null
  ) => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { data, error } = await supabase
      .from("nutrition_logs")
      .upsert({
        user_id: user.id,
        date,
        calories,
        protein_g: proteinG,
        carbs_g: carbsG,
        fat_g: fatG,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,date" })
      .select()
      .single();

    if (data && !error) {
      setLog({
        id: data.id,
        date: data.date,
        calories: data.calories,
        proteinG: data.protein_g,
        carbsG: data.carbs_g,
        fatG: data.fat_g,
        waterIntakeOz: data.water_intake_oz,
      });
    }
    setSaving(false);
  }, [date, supabase]);

  const addWater = useCallback(async (oz: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentWater = log?.waterIntakeOz || 0;
    const newWater = currentWater + oz;

    const { data, error } = await supabase
      .from("nutrition_logs")
      .upsert({
        user_id: user.id,
        date,
        water_intake_oz: newWater,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,date" })
      .select()
      .single();

    if (data && !error) {
      setLog((prev) => prev
        ? { ...prev, waterIntakeOz: data.water_intake_oz }
        : {
            id: data.id,
            date: data.date,
            calories: data.calories,
            proteinG: data.protein_g,
            carbsG: data.carbs_g,
            fatG: data.fat_g,
            waterIntakeOz: data.water_intake_oz,
          }
      );
    }
  }, [date, log, supabase]);

  return { log, loading, saving, saveLog, addWater };
}

export function useNutritionHistory() {
  const supabase = createClient();
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (data) {
        setLogs(data.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          date: d.date as string,
          calories: d.calories as number | null,
          proteinG: d.protein_g as number | null,
          carbsG: d.carbs_g as number | null,
          fatG: d.fat_g as number | null,
          waterIntakeOz: d.water_intake_oz as number | null,
        })));
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  return { logs, loading };
}
