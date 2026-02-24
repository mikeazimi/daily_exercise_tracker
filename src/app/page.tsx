"use client";

import { getTodaysWorkoutType, getWorkoutLabel, formatDate } from "@/lib/utils";
import { WorkoutView } from "@/components/workout/workout-view";

export default function HomePage() {
  const today = new Date();
  const workoutType = getTodaysWorkoutType(today);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {formatDate(today)}
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {workoutType === "rest" ? "Rest Day" : `Workout ${workoutType}`}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {getWorkoutLabel(workoutType)}
        </p>
      </div>

      {/* Workout or rest message */}
      {workoutType === "rest" ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl">🧘</div>
          <h2 className="text-lg font-semibold">Recovery Day</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Rest and recover. Your muscles grow during rest, not during the workout.
            Stay hydrated and get good sleep.
          </p>
        </div>
      ) : (
        <WorkoutView workoutType={workoutType} />
      )}
    </div>
  );
}
