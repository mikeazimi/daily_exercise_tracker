"use client";

import { useState } from "react";
import { getTodaysWorkoutType, getWorkoutLabel, formatDate } from "@/lib/utils";
import { WorkoutView } from "@/components/workout/workout-view";
import { DatePicker } from "@/components/workout/date-picker";
import { MeasurementBanner } from "@/components/body/measurement-banner";
import { MacroSummary } from "@/components/nutrition/macro-summary";
import { RecoveryCard } from "@/components/whoop/recovery-card";
import { useBodyMeasurements } from "@/hooks/use-body-measurements";
import { useNutritionLog } from "@/hooks/use-nutrition-log";
import { useWhoopData } from "@/hooks/use-whoop-data";
import { useNutritionTargets } from "@/hooks/use-nutrition-targets";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const workoutType = getTodaysWorkoutType(selectedDate);
  const dateStr = selectedDate.toISOString().split("T")[0];
  const isToday = dateStr === new Date().toISOString().split("T")[0];

  const { latest, daysSinceLastMeasurement, saving: bodySaving, saveMeasurement } = useBodyMeasurements();
  const { log: nutritionLog, loading: nutritionLoading, saving: nutritionSaving, saveLog } = useNutritionLog(dateStr);
  const { todayData: whoopToday, isConnected: whoopConnected } = useWhoopData();
  const targets = useNutritionTargets(latest, whoopToday, selectedDate);

  return (
    <div className="space-y-4">
      {/* Date picker */}
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Weekly weigh-in banner (only on today) */}
      {isToday && (
        <MeasurementBanner
          daysSinceLastMeasurement={daysSinceLastMeasurement}
          saving={bodySaving}
          onSave={(w, bf) => saveMeasurement(dateStr, w, bf)}
        />
      )}

      {/* Whoop recovery (only if connected and today has data) */}
      {whoopConnected && whoopToday && isToday && (
        <RecoveryCard data={whoopToday} />
      )}

      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {formatDate(selectedDate)}
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {workoutType === "rest" ? "Rest Day" : `Workout ${workoutType}`}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {getWorkoutLabel(workoutType)}
        </p>
      </div>

      {/* Nutrition summary */}
      <MacroSummary
        log={nutritionLog}
        loading={nutritionLoading}
        saving={nutritionSaving}
        onSave={saveLog}
        targets={targets}
      />

      {/* Workout or rest message */}
      {workoutType === "rest" ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">&#x1F9D8;</div>
          <h2 className="text-lg font-semibold">Recovery Day</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Rest and recover. Your muscles grow during rest, not during the workout.
            Stay hydrated and get good sleep.
          </p>
        </div>
      ) : (
        <WorkoutView workoutType={workoutType} date={selectedDate} />
      )}
    </div>
  );
}
