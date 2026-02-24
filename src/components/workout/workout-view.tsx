"use client";

import { useCallback, useState } from "react";
import { getPhaseGroups, getExercisesForWorkout } from "@/lib/data/exercises";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useProgression } from "@/hooks/use-progression";
import { usePersonalRecords, type PRResult } from "@/hooks/use-personal-records";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { PhaseSection } from "./phase-section";
import { ProgressionBanner } from "./progression-banner";
import { PRCelebration } from "./pr-celebration";
import { RestTimer } from "./rest-timer";
import { WorkoutNotes } from "./workout-notes";
import { cn } from "@/lib/utils";

interface WorkoutViewProps {
  workoutType: "A" | "B";
  date: Date;
}

export function WorkoutView({ workoutType, date }: WorkoutViewProps) {
  const phases = getPhaseGroups(workoutType);
  const exercises = getExercisesForWorkout(workoutType);
  const { recommendations, acceptRecommendation, dismissRecommendation } = useProgression();
  const { checkForPR } = usePersonalRecords();
  const [prResult, setPrResult] = useState<PRResult | null>(null);

  const restTimerSeconds = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("rest-timer-seconds") || "90", 10)
    : 90;
  const restTimer = useRestTimer(restTimerSeconds);

  const todayExerciseIds = exercises.map((e) => e.id);
  const relevantRecs = recommendations.filter((r) => todayExerciseIds.includes(r.exerciseId));

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
    updateX3Log,
    completeSession,
    updateNotes,
    completedCount,
    totalCount,
    isComplete,
  } = useWorkoutSession(workoutType, exercises, date);

  const handleExerciseLogged = useCallback((exerciseId?: string, exerciseName?: string, bandId?: string, fullReps?: number, estimatedForce?: number) => {
    if (!isComplete) restTimer.start();
    if (exerciseId && exerciseName && bandId && fullReps && estimatedForce && session) {
      checkForPR(exerciseId, exerciseName, bandId, fullReps, estimatedForce, session.id).then((result) => {
        if (result) setPrResult(result);
      });
    }
  }, [restTimer, isComplete, session, checkForPR]);

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
      {/* PR celebration overlay */}
      <PRCelebration result={prResult} onDone={() => setPrResult(null)} />

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

      {/* Progression recommendations */}
      {isToday && relevantRecs.length > 0 && (
        <ProgressionBanner
          recommendations={relevantRecs}
          onAccept={acceptRecommendation}
          onDismiss={dismissRecommendation}
        />
      )}

      {/* Start button or phases */}
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
            {phases.map((phase) => (
              <PhaseSection
                key={phase.phase}
                phase={phase}
                logs={logs}
                sessionActive={false}
                onToggle={() => {}}
                onUpdateX3={() => {}}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {phases.map((phase) => (
              <PhaseSection
                key={phase.phase}
                phase={phase}
                logs={logs}
                sessionActive={!isComplete}
                onToggle={toggleExercise}
                onUpdateX3={updateX3Log}
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
