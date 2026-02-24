import type { X3ProgressPoint } from "@/hooks/use-progress-data";
import { X3_BANDS } from "@/lib/data/bands";
import { EXERCISES } from "@/lib/data/exercises";

export type RecommendationType = "band_up" | "band_down";

export interface ProgressionRecommendation {
  exerciseId: string;
  exerciseName: string;
  type: RecommendationType;
  currentBandId: string;
  suggestedBandId: string;
  currentBandName: string;
  suggestedBandName: string;
  avgFullReps: number;
  sessionCount: number;
  reason: string;
}

const BAND_ORDER = X3_BANDS.map((b) => b.id);

export function analyzeProgression(
  allData: X3ProgressPoint[],
  exerciseId: string
): ProgressionRecommendation | null {
  // Filter to this exercise, sort by date desc
  const history = allData
    .filter((d) => d.exerciseId === exerciseId)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Need at least 3 sessions
  if (history.length < 3) return null;

  const last3 = history.slice(0, 3);

  // All 3 must use the same band
  const bandName = last3[0].bandName;
  if (!last3.every((s) => s.bandName === bandName)) return null;

  const avgFullReps = Math.round(last3.reduce((sum, s) => sum + s.fullReps, 0) / 3);

  // Find current band index
  const currentBand = X3_BANDS.find((b) => b.name === bandName);
  if (!currentBand) return null;
  const currentIdx = BAND_ORDER.indexOf(currentBand.id);

  const exercise = EXERCISES.find((e) => e.id === exerciseId);
  const exerciseName = exercise?.name || exerciseId;

  // Band UP: avg >= 15 full reps
  if (avgFullReps >= 15 && currentIdx < BAND_ORDER.length - 1) {
    const nextBand = X3_BANDS[currentIdx + 1];
    return {
      exerciseId,
      exerciseName,
      type: "band_up",
      currentBandId: currentBand.id,
      suggestedBandId: nextBand.id,
      currentBandName: currentBand.name,
      suggestedBandName: nextBand.name,
      avgFullReps,
      sessionCount: 3,
      reason: `Averaged ${avgFullReps} full reps over last 3 sessions on ${currentBand.name}`,
    };
  }

  // Band DOWN: avg < 8 full reps
  if (avgFullReps < 8 && currentIdx > 0) {
    const prevBand = X3_BANDS[currentIdx - 1];
    return {
      exerciseId,
      exerciseName,
      type: "band_down",
      currentBandId: currentBand.id,
      suggestedBandId: prevBand.id,
      currentBandName: currentBand.name,
      suggestedBandName: prevBand.name,
      avgFullReps,
      sessionCount: 3,
      reason: `Averaged only ${avgFullReps} full reps over last 3 sessions on ${currentBand.name}`,
    };
  }

  return null;
}

export function analyzeAllExercises(x3Progress: X3ProgressPoint[]): ProgressionRecommendation[] {
  const exerciseIds = new Set(x3Progress.map((d) => d.exerciseId));
  const recommendations: ProgressionRecommendation[] = [];

  for (const id of exerciseIds) {
    const rec = analyzeProgression(x3Progress, id);
    if (rec) recommendations.push(rec);
  }

  return recommendations;
}
