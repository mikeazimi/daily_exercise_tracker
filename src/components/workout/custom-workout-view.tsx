"use client";

import { useCallback } from "react";
import type { WorkoutDay } from "@/hooks/use-user-program";
import { useCustomWorkoutSession } from "@/hooks/use-custom-workout-session";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { CustomSectionView } from "./custom-section-view";
import { RestTimer } from "./rest-timer";
import { WorkoutNotes } from "./workout-notes";
import { cn } from "@/lib/utils";

interface CustomWorkoutViewProps {
  workoutDay: WorkoutDay;
  programId: string | null;
  date: Date;
}

export function CustomWorkoutView({ workoutDay, programId, date }: CustomWorkoutViewProps) {
  const restTimerSeconds = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("rest-timer-seconds") || "90", 10)
    : 90;
  const restTimer = useRestTimer(restTimerSeconds);

  const isToday = new Date().toISOString().split("T")[0] === date.toISOString().split("T")[0];
  const isFuture = date.toISOString().split("T")[0] > new Date().toISOString().split("T")[0];
  const isPast = !isToday && !isFuture;

  const {
    session,
    logs,
    loading,
    saving,
    startSession,
    toggleExercise,
    logSet,
    addSet,
    updateX3Log,
    completeSession,
    updateNotes,
    completedCount,
    totalCount,
    isComplete,
  } = useCustomWorkoutSession(workoutDay, programId, date);

  const handleExerciseLogged = useCallback(() => {
    if (!isComplete) restTimer.start();
  }, [restTimer, isComplete]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Rest timer overlay */}
      <RestTimer
        remaining={restTimer.remaining}
        isRunning={restTimer.isRunning}
        onSkip={restTimer.stop}
      />

      {/* Progress bar */}
      {session && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {completedCount} of {totalCount} exercises
            </span>
            {saving && (
              <span className="text-muted-foreground animate-pulse">Saving...</span>
            )}
            {isComplete && (
              <span className="text-success font-medium">Workout Complete</span>
            )}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isComplete ? "bg-success" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Start button or sections */}
      {!session ? (
        <div className="text-center py-8 space-y-4">
          {isFuture ? (
            <p className="text-muted-foreground text-sm">
              Upcoming workout preview
            </p>
          ) : isPast ? (
            <p className="text-muted-foreground text-sm">
              No workout recorded for this day
            </p>
          ) : (
            <>
              <p className="text-muted-foreground text-sm">
                Ready to begin your workout?
              </p>
              <button
                onClick={startSession}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Start Workout
              </button>
            </>
          )}

          {/* Show exercises preview */}
          <div className="mt-8 space-y-6">
            {workoutDay.sections.map((section, idx) => (
              <CustomSectionView
                key={idx}
                section={section}
                sectionIndex={idx}
                logs={logs}
                sessionActive={false}
                onToggle={() => {}}
                onUpdateX3={() => {}}
                onLogSet={() => {}}
                onAddSet={() => {}}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {workoutDay.sections.map((section, idx) => (
              <CustomSectionView
                key={idx}
                section={section}
                sectionIndex={idx}
                logs={logs}
                sessionActive={!isComplete}
                onToggle={toggleExercise}
                onUpdateX3={updateX3Log}
                onLogSet={logSet}
                onAddSet={addSet}
                onExerciseLogged={handleExerciseLogged}
              />
            ))}
          </div>

          {/* Workout notes */}
          <WorkoutNotes
            notes={session.notes || ""}
            onSave={updateNotes}
            disabled={isComplete}
          />

          {/* Complete button */}
          {!isComplete && completedCount === totalCount && totalCount > 0 && (
            <div className="text-center pt-4">
              <button
                onClick={completeSession}
                className="px-6 py-3 bg-success text-background font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Complete Workout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
