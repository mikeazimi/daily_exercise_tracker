export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface NutritionInputs {
  weightLbs: number;
  bodyFatPct: number | null;
  isWorkoutDay: boolean;
  whoopStrain: number | null;
  whoopRecoveryScore: number | null;
}

export function calculateTDEE(
  weightLbs: number,
  bodyFatPct: number | null,
  activityMultiplier: number
): number {
  const weightKg = weightLbs * 0.453592;

  if (bodyFatPct !== null) {
    // Katch-McArdle formula (preferred when body fat % is known)
    const lbmKg = weightKg * (1 - bodyFatPct / 100);
    const bmr = 370 + 21.6 * lbmKg;
    return Math.round(bmr * activityMultiplier);
  }

  // Fallback: Mifflin-St Jeor (assume male, age ~30, height ~5'10" / 178cm)
  // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 5
  const bmr = 10 * weightKg + 6.25 * 178 - 5 * 30 - 5;
  return Math.round(bmr * activityMultiplier);
}

export function calculateMacroTargets(inputs: NutritionInputs): MacroTargets {
  const { weightLbs, bodyFatPct, isWorkoutDay, whoopStrain, whoopRecoveryScore } = inputs;

  // Activity multiplier based on Whoop strain or default
  let activityMultiplier = 1.55; // moderate exercise default
  if (whoopStrain !== null) {
    if (whoopStrain < 7) activityMultiplier = 1.4;
    else if (whoopStrain < 14) activityMultiplier = 1.6;
    else activityMultiplier = 1.8;
  }

  // Reduce TDEE if recovery is poor
  let tdee = calculateTDEE(weightLbs, bodyFatPct, activityMultiplier);
  if (whoopRecoveryScore !== null && whoopRecoveryScore < 34) {
    tdee = Math.round(tdee * 0.95);
  }

  // Lean body mass
  const lbmLbs = bodyFatPct !== null
    ? weightLbs * (1 - bodyFatPct / 100)
    : weightLbs * 0.8; // estimate 20% bf if unknown

  // Protein: 1g/lb LBM on workout days, 0.8g/lb on rest
  const proteinG = Math.round(lbmLbs * (isWorkoutDay ? 1.0 : 0.8));
  const proteinCals = proteinG * 4;

  // Fat: min 0.3g/lb bodyweight, or 25% of TDEE (whichever is higher)
  const fatMinG = weightLbs * 0.3;
  const fat25PctG = (tdee * 0.25) / 9;
  const fatG = Math.round(Math.max(fatMinG, fat25PctG));
  const fatCals = fatG * 9;

  // Carbs: fill remaining, adjust for workout/rest days
  let remainingCals = tdee - proteinCals - fatCals;
  if (isWorkoutDay) remainingCals += 150;
  else remainingCals -= 150;
  const carbsG = Math.round(Math.max(0, remainingCals / 4));

  // Recalculate total calories from macros
  const calories = proteinCals + fatCals + carbsG * 4;

  return { calories, proteinG, carbsG, fatG };
}

export type ComplianceLevel = "green" | "yellow" | "red";

export function getComplianceLevel(actual: number, target: number): ComplianceLevel {
  if (target === 0) return "green";
  const pctOff = Math.abs(actual - target) / target;
  if (pctOff <= 0.10) return "green";
  if (pctOff <= 0.20) return "yellow";
  return "red";
}
