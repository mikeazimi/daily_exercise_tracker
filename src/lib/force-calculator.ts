import { type BandProfile, getBandById } from "@/lib/data/bands";

/**
 * Calculate estimated force for an X3 set.
 *
 * The X3 method goes to failure: you do full ROM reps until you can't,
 * then partial reps with diminishing range. The peak force is the band's
 * max resistance at full extension. We also calculate a "total work"
 * metric that accounts for both full and partial reps.
 */
export function calculateEstimatedForce(
  bandId: string,
  fullReps: number,
  partialReps: number
): { peakForce: number; avgForce: number; totalWork: number } | null {
  const band = getBandById(bandId);
  if (!band) return null;

  const peakForce = band.maxResistanceLbs;
  const avgForce = Math.round((band.minResistanceLbs + band.maxResistanceLbs) / 2);

  // Total work approximation:
  // Full reps use full ROM = avg force * full reps
  // Partial reps use ~50% ROM = avg of (min + avg) * partial reps
  const partialAvg = Math.round((band.minResistanceLbs + avgForce) / 2);
  const totalWork = avgForce * fullReps + partialAvg * partialReps;

  return { peakForce, avgForce, totalWork };
}

export function getForceDisplay(band: BandProfile): string {
  return `${band.minResistanceLbs}–${band.maxResistanceLbs} lbs`;
}
