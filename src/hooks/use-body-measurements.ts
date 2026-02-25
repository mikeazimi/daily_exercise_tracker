"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { differenceInDays } from "date-fns";

export interface BodyMeasurement {
  id: string;
  date: string;
  weightLbs: number | null;
  bodyFatPct: number | null;
}

export function useBodyMeasurements() {
  const supabase = createClient();
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (data) {
        setMeasurements(data.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          date: m.date as string,
          weightLbs: m.weight_lbs as number | null,
          bodyFatPct: m.body_fat_pct as number | null,
        })));
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const latest = measurements[0] || null;

  const daysSinceLastMeasurement = latest
    ? differenceInDays(new Date(), new Date(latest.date + "T00:00:00"))
    : null;

  const saveMeasurement = useCallback(async (
    date: string,
    weightLbs: number | null,
    bodyFatPct: number | null
  ) => {
    setSaving(true);
    if (!user) { setSaving(false); return; }

    const { data, error } = await supabase
      .from("body_measurements")
      .upsert({
        user_id: user.id,
        date,
        weight_lbs: weightLbs,
        body_fat_pct: bodyFatPct,
      }, { onConflict: "user_id,date" })
      .select()
      .single();

    if (data && !error) {
      const newMeasurement: BodyMeasurement = {
        id: data.id,
        date: data.date,
        weightLbs: data.weight_lbs,
        bodyFatPct: data.body_fat_pct,
      };
      setMeasurements((prev) => {
        const filtered = prev.filter((m) => m.date !== date);
        return [newMeasurement, ...filtered].sort(
          (a, b) => b.date.localeCompare(a.date)
        );
      });
    }
    setSaving(false);
  }, [supabase, user]);

  return { measurements, latest, loading, saving, saveMeasurement, daysSinceLastMeasurement };
}
