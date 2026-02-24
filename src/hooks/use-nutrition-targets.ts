"use client";

import { useMemo } from "react";
import { calculateMacroTargets, type MacroTargets } from "@/lib/nutrition/calculator";
import type { BodyMeasurement } from "@/hooks/use-body-measurements";
import type { WhoopDayData } from "@/hooks/use-whoop-data";
import { getTodaysWorkoutType } from "@/lib/utils";

export function useNutritionTargets(
  latestMeasurement: BodyMeasurement | null,
  todayWhoop: WhoopDayData | null,
  date: Date
): MacroTargets | null {
  return useMemo(() => {
    if (!latestMeasurement?.weightLbs) return null;

    const workoutType = getTodaysWorkoutType(date);
    const isWorkoutDay = workoutType !== "rest";

    return calculateMacroTargets({
      weightLbs: latestMeasurement.weightLbs,
      bodyFatPct: latestMeasurement.bodyFatPct,
      isWorkoutDay,
      whoopStrain: todayWhoop?.strain ?? null,
      whoopRecoveryScore: todayWhoop?.recoveryScore ?? null,
    });
  }, [latestMeasurement, todayWhoop, date]);
}
