"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export interface UserSettings {
  onboardingCompleted: boolean;
  restTimerSeconds: number;
  deloadFrequencyWeeks: number;
  deloadEnabled: boolean;
  weeklyWorkoutTarget: number;
  waterTargetOz: number | null;
  enableNutrition: boolean;
  enableWater: boolean;
  enableProgressPhotos: boolean;
  enableBodyMeasurements: boolean;
  enableWhoop: boolean;
  enableDeload: boolean;
}

const DEFAULTS: UserSettings = {
  onboardingCompleted: false,
  restTimerSeconds: 90,
  deloadFrequencyWeeks: 4,
  deloadEnabled: true,
  weeklyWorkoutTarget: 3,
  waterTargetOz: null,
  enableNutrition: true,
  enableWater: true,
  enableProgressPhotos: true,
  enableBodyMeasurements: true,
  enableWhoop: true,
  enableDeload: true,
};

export function useUserSettings() {
  const supabase = createClient();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setSettings({
          onboardingCompleted: data.onboarding_completed ?? false,
          restTimerSeconds: data.rest_timer_seconds ?? 90,
          deloadFrequencyWeeks: data.deload_frequency_weeks ?? 4,
          deloadEnabled: data.deload_enabled ?? true,
          weeklyWorkoutTarget: data.weekly_workout_target ?? 3,
          waterTargetOz: data.water_target_oz ?? null,
          enableNutrition: data.enable_nutrition ?? true,
          enableWater: data.enable_water ?? true,
          enableProgressPhotos: data.enable_progress_photos ?? true,
          enableBodyMeasurements: data.enable_body_measurements ?? true,
          enableWhoop: data.enable_whoop ?? true,
          enableDeload: data.enable_deload ?? true,
        });
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const saveSettings = useCallback(
    async (updates: Partial<UserSettings>) => {
      if (!user) return;
      setSaving(true);

      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;
      if (updates.restTimerSeconds !== undefined) dbUpdates.rest_timer_seconds = updates.restTimerSeconds;
      if (updates.deloadFrequencyWeeks !== undefined) dbUpdates.deload_frequency_weeks = updates.deloadFrequencyWeeks;
      if (updates.deloadEnabled !== undefined) dbUpdates.deload_enabled = updates.deloadEnabled;
      if (updates.weeklyWorkoutTarget !== undefined) dbUpdates.weekly_workout_target = updates.weeklyWorkoutTarget;
      if (updates.waterTargetOz !== undefined) dbUpdates.water_target_oz = updates.waterTargetOz;
      if (updates.enableNutrition !== undefined) dbUpdates.enable_nutrition = updates.enableNutrition;
      if (updates.enableWater !== undefined) dbUpdates.enable_water = updates.enableWater;
      if (updates.enableProgressPhotos !== undefined) dbUpdates.enable_progress_photos = updates.enableProgressPhotos;
      if (updates.enableBodyMeasurements !== undefined) dbUpdates.enable_body_measurements = updates.enableBodyMeasurements;
      if (updates.enableWhoop !== undefined) dbUpdates.enable_whoop = updates.enableWhoop;
      if (updates.enableDeload !== undefined) dbUpdates.enable_deload = updates.enableDeload;

      // Upsert: create row if it doesn't exist, update if it does
      const { data } = await supabase
        .from("user_settings")
        .upsert(
          { user_id: user.id, ...dbUpdates },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (data) {
        setSettings((prev) => ({ ...prev, ...updates }));
      }

      setSaving(false);
    },
    [supabase, user]
  );

  return { settings, loading, saving, saveSettings };
}
