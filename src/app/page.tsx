"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { WorkoutView } from "@/components/workout/workout-view";
import { CustomWorkoutView } from "@/components/workout/custom-workout-view";
import { DatePicker } from "@/components/workout/date-picker";
import { MeasurementBanner } from "@/components/body/measurement-banner";
import { MacroSummary } from "@/components/nutrition/macro-summary";
import { WaterTracker } from "@/components/nutrition/water-tracker";
import { RecoveryCard } from "@/components/whoop/recovery-card";
import { StreakBadge } from "@/components/workout/streak-badge";
import { WeeklySummary } from "@/components/workout/weekly-summary";
import { DeloadBanner } from "@/components/workout/deload-banner";
import { useBodyMeasurements } from "@/hooks/use-body-measurements";
import { useNutritionLog } from "@/hooks/use-nutrition-log";
import { useWhoopData } from "@/hooks/use-whoop-data";
import { useNutritionTargets } from "@/hooks/use-nutrition-targets";
import { useProgressData } from "@/hooks/use-progress-data";
import { useStreaks } from "@/hooks/use-streaks";
import { useWeeklySummary } from "@/hooks/use-weekly-summary";
import { useDeload } from "@/hooks/use-deload";
import { useProgressPhotos } from "@/hooks/use-progress-photos";
import { PhotoUpload } from "@/components/body/photo-upload";
import { useUserProgram } from "@/hooks/use-user-program";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { program, loading: programLoading, getTodaysWorkout } = useUserProgram();
  const todaysWorkout = getTodaysWorkout(selectedDate);
  const dateStr = selectedDate.toISOString().split("T")[0];
  const isToday = dateStr === new Date().toISOString().split("T")[0];

  const { latest, daysSinceLastMeasurement, saving: bodySaving, saveMeasurement } = useBodyMeasurements();
  const { log: nutritionLog, loading: nutritionLoading, saving: nutritionSaving, saveLog, addWater } = useNutritionLog(dateStr);
  const { todayData: whoopToday, isConnected: whoopConnected } = useWhoopData();
  const targets = useNutritionTargets(latest, whoopToday, selectedDate);
  const { sessions } = useProgressData();
  const streakData = useStreaks(sessions);
  const { data: weeklySummaryData, loading: weeklyLoading } = useWeeklySummary();

  const [deloadFrequency, setDeloadFrequency] = useState(4);
  useEffect(() => {
    const stored = localStorage.getItem("deload-frequency-weeks");
    if (stored) setDeloadFrequency(parseInt(stored, 10));
  }, []);
  const deloadInfo = useDeload(sessions, deloadFrequency);
  const { uploading: photoUploading, uploadPhoto } = useProgressPhotos();
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const waterTarget = latest?.weightLbs ? Math.round(latest.weightLbs * 0.5) : 96;

  return (
    <div className="space-y-4">
      {/* Date picker */}
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Streak badge */}
      {isToday && <StreakBadge streak={streakData} />}

      {/* Weekly weigh-in banner (only on today) */}
      {isToday && (
        <MeasurementBanner
          daysSinceLastMeasurement={daysSinceLastMeasurement}
          saving={bodySaving}
          onSave={(w, bf) => saveMeasurement(dateStr, w, bf)}
        />
      )}

      {/* Deload banner */}
      {isToday && <DeloadBanner deload={deloadInfo} />}

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
          {todaysWorkout.type === "rest" ? "Rest Day" : todaysWorkout.name}
        </h1>
        {todaysWorkout.type !== "rest" && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {todaysWorkout.type === "custom" ? "Custom Program" : todaysWorkout.name}
          </p>
        )}
      </div>

      {/* Weekly summary */}
      {isToday && <WeeklySummary data={weeklySummaryData} loading={weeklyLoading} />}

      {/* Nutrition summary */}
      <MacroSummary
        log={nutritionLog}
        loading={nutritionLoading}
        saving={nutritionSaving}
        onSave={saveLog}
        targets={targets}
      />

      {/* Water tracker */}
      {isToday && (
        <WaterTracker
          currentOz={nutritionLog?.waterIntakeOz || 0}
          targetOz={waterTarget}
          onAdd={addWater}
        />
      )}

      {/* Progress photo */}
      {isToday && (
        <div className="space-y-2">
          <button
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-card text-xs"
          >
            <span className="font-medium">&#x1F4F7; Progress Photo</span>
            <span className="text-muted-foreground">{showPhotoUpload ? "Hide" : "Add"}</span>
          </button>
          {showPhotoUpload && (
            <PhotoUpload
              date={dateStr}
              uploading={photoUploading}
              onUpload={(file, type, date) => {
                uploadPhoto(file, type, date);
                setShowPhotoUpload(false);
              }}
            />
          )}
        </div>
      )}

      {/* Workout or rest message */}
      {todaysWorkout.type === "rest" ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">&#x1F9D8;</div>
          <h2 className="text-lg font-semibold">Recovery Day</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Rest and recover. Your muscles grow during rest, not during the workout.
            Stay hydrated and get good sleep.
          </p>
        </div>
      ) : todaysWorkout.type === "custom" && todaysWorkout.workoutDay ? (
        <CustomWorkoutView
          workoutDay={todaysWorkout.workoutDay}
          programId={program?.id || null}
          date={selectedDate}
        />
      ) : todaysWorkout.legacyType ? (
        <WorkoutView workoutType={todaysWorkout.legacyType} date={selectedDate} />
      ) : null}
    </div>
  );
}
