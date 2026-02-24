export interface ExerciseDefinition {
  id: string;
  name: string;
  description: string;
  workoutType: "A" | "B";
  phase: number;
  phaseName: string;
  phaseTimeRange: string;
  orderIndex: number;
  defaultReps: string;
  isX3: boolean;
  isTimed: boolean;
}

export const EXERCISES: ExerciseDefinition[] = [
  // ── Workout A: Push & Posture ──────────────────────────────────
  // Phase 1: Posture & Mobility Warm-up
  {
    id: "a-1-1",
    name: "Cat-Cow",
    description:
      "Get on all fours. Inhale as you drop your belly and lift your chest (Cow). Exhale as you round your spine toward the ceiling and tuck your chin (Cat).",
    workoutType: "A",
    phase: 1,
    phaseName: "Posture & Mobility Warm-up",
    phaseTimeRange: "0–10 Minutes",
    orderIndex: 1,
    defaultReps: "15 reps",
    isX3: false,
    isTimed: false,
  },
  {
    id: "a-1-2",
    name: "Wall Angels",
    description:
      'Stand with your heels, butt, upper back, and head against a wall. Raise your arms to 90 degrees (like a goalpost) with elbows and wrists touching the wall. Slowly slide your arms up and down without letting any part of your back or arms lose contact with the wall.',
    workoutType: "A",
    phase: 1,
    phaseName: "Posture & Mobility Warm-up",
    phaseTimeRange: "0–10 Minutes",
    orderIndex: 2,
    defaultReps: "20 reps",
    isX3: false,
    isTimed: false,
  },
  {
    id: "a-1-3",
    name: "Band Pull-Aparts",
    description:
      "Using a standard, light resistance band (not an X3 band), hold it straight out in front of your chest. Keep your arms straight and squeeze your shoulder blades together to pull the band apart until it touches your chest. Return slowly.",
    workoutType: "A",
    phase: 1,
    phaseName: "Posture & Mobility Warm-up",
    phaseTimeRange: "0–10 Minutes",
    orderIndex: 3,
    defaultReps: "20 reps",
    isX3: false,
    isTimed: false,
  },

  // Phase 2: Iron Neck
  {
    id: "a-2-1",
    name: "Protraction & Retraction / Chin Tucks",
    description:
      'Facing away from the anchor, push your head forward (protract) against the band\'s resistance. Then, pull your head straight back, giving yourself a "double chin" (retract).',
    workoutType: "A",
    phase: 2,
    phaseName: "Iron Neck – Isometrics & Stability",
    phaseTimeRange: "10–20 Minutes",
    orderIndex: 1,
    defaultReps: "15 reps",
    isX3: false,
    isTimed: false,
  },
  {
    id: "a-2-2",
    name: "Left & Right Look",
    description:
      "Stand with the anchor to your side so the tension pulls laterally. Slowly turn your head to look over one shoulder, then the other, keeping your shoulders completely still. Switch sides.",
    workoutType: "A",
    phase: 2,
    phaseName: "Iron Neck – Isometrics & Stability",
    phaseTimeRange: "10–20 Minutes",
    orderIndex: 2,
    defaultReps: "15 reps per side",
    isX3: false,
    isTimed: false,
  },
  {
    id: "a-2-3",
    name: "Isometric Holds",
    description:
      "Step out to create tension. Hold your head perfectly straight and still. Do this facing the anchor, facing away from the anchor, and with the anchor to your left, then your right.",
    workoutType: "A",
    phase: 2,
    phaseName: "Iron Neck – Isometrics & Stability",
    phaseTimeRange: "10–20 Minutes",
    orderIndex: 3,
    defaultReps: "30 seconds each direction",
    isX3: false,
    isTimed: true,
  },

  // Phase 3: X3 Push
  {
    id: "a-3-1",
    name: "Front Squat",
    description:
      "Step on the footplate. Hook the band under the plate and over the bar. Bring the bar up to your collarbone (resting on the front of your shoulders). Squat down, keeping your chest up, and stand back up to near-lockout.",
    workoutType: "A",
    phase: 3,
    phaseName: "X3 System – Push Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 1,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
  {
    id: "a-3-2",
    name: "Chest Press",
    description:
      "Wrap the band around your back. Push the bar straight out in front of your chest. Do not lock your elbows at the top; keep the tension on your chest.",
    workoutType: "A",
    phase: 3,
    phaseName: "X3 System – Push Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 2,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
  {
    id: "a-3-3",
    name: "Overhead Press",
    description:
      "Step on the band. Bring the bar to your upper chest. Press the bar straight up over your head until your arms are extended, then slowly lower it back to your collarbone.",
    workoutType: "A",
    phase: 3,
    phaseName: "X3 System – Push Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 3,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
  {
    id: "a-3-4",
    name: "Triceps Press",
    description:
      "Step on the band. Lean slightly forward. Hold the bar with an overhand grip at chest level. Keep your elbows pinned to your ribs and press the bar straight down toward your thighs.",
    workoutType: "A",
    phase: 3,
    phaseName: "X3 System – Push Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 4,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },

  // ── Workout B: Pull & Core ─────────────────────────────────────
  // Phase 1: Posture & Core Warm-up
  {
    id: "b-1-1",
    name: "Plank",
    description:
      "Support your weight on your forearms and toes. Keep your body in a perfectly straight line from your head to your heels. Squeeze your glutes and brace your core.",
    workoutType: "B",
    phase: 1,
    phaseName: "Posture & Core Warm-up",
    phaseTimeRange: "0–10 Minutes",
    orderIndex: 1,
    defaultReps: "60 seconds",
    isX3: false,
    isTimed: true,
  },
  {
    id: "b-1-2",
    name: "Glute Bridges",
    description:
      "Lie on your back with knees bent and feet flat on the floor. Drive through your heels to lift your hips toward the ceiling. Squeeze your glutes hard at the top for 2 seconds, then lower down.",
    workoutType: "B",
    phase: 1,
    phaseName: "Posture & Core Warm-up",
    phaseTimeRange: "0–10 Minutes",
    orderIndex: 2,
    defaultReps: "20 reps",
    isX3: false,
    isTimed: false,
  },
  {
    id: "b-1-3",
    name: "Bird-Dog",
    description:
      'Get on all fours. Extend your right arm straight forward and your left leg straight back simultaneously. Keep your back completely flat (imagine balancing a glass of water on it). Return to the start and switch sides.',
    workoutType: "B",
    phase: 1,
    phaseName: "Posture & Core Warm-up",
    phaseTimeRange: "0–10 Minutes",
    orderIndex: 3,
    defaultReps: "10 reps per side",
    isX3: false,
    isTimed: false,
  },

  // Phase 2: Iron Neck – Rotational
  {
    id: "b-2-1",
    name: "360 Spins",
    description:
      "Step away from the anchor to create moderate tension. Slowly walk in a complete, controlled circle while keeping your head and neck perfectly aligned and stable. Repeat in the opposite direction.",
    workoutType: "B",
    phase: 2,
    phaseName: "Iron Neck – Rotational Strength",
    phaseTimeRange: "10–20 Minutes",
    orderIndex: 1,
    defaultReps: "5 spins each way",
    isX3: false,
    isTimed: false,
  },
  {
    id: "b-2-2",
    name: "Figure Eights",
    description:
      'Facing away from the anchor, use your nose as a pointer and slowly trace a large "8" in the air. Keep the movement strictly in your neck, not your torso.',
    workoutType: "B",
    phase: 2,
    phaseName: "Iron Neck – Rotational Strength",
    phaseTimeRange: "10–20 Minutes",
    orderIndex: 2,
    defaultReps: "10 reps",
    isX3: false,
    isTimed: false,
  },
  {
    id: "b-2-3",
    name: "Diagonals",
    description:
      "Stand with the anchor behind you. Look down toward your left hip, then trace a diagonal line up toward the ceiling on your right side. Complete all reps, then switch to down-right/up-left.",
    workoutType: "B",
    phase: 2,
    phaseName: "Iron Neck – Rotational Strength",
    phaseTimeRange: "10–20 Minutes",
    orderIndex: 3,
    defaultReps: "10 reps per side",
    isX3: false,
    isTimed: false,
  },

  // Phase 3: X3 Pull
  {
    id: "b-3-1",
    name: "Deadlift",
    description:
      "Step on the footplate with the band looped under it. Hinge at your hips, grab the bar, keep your back completely flat, and stand up straight. Thrust your hips slightly forward at the top.",
    workoutType: "B",
    phase: 3,
    phaseName: "X3 System – Pull Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 1,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
  {
    id: "b-3-2",
    name: "Bent-Over Row",
    description:
      "Step on the band. Hinge forward at a 45-degree angle. Let the bar hang down, then pull it firmly up to your belly button, squeezing your back muscles. Lower it slowly.",
    workoutType: "B",
    phase: 3,
    phaseName: "X3 System – Pull Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 2,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
  {
    id: "b-3-3",
    name: "Bicep Curl",
    description:
      "Step on the band. Hold the bar with an underhand grip. Keep your elbows locked at your sides and curl the bar up toward your shoulders.",
    workoutType: "B",
    phase: 3,
    phaseName: "X3 System – Pull Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 3,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
  {
    id: "b-3-4",
    name: "Calf Raise",
    description:
      'Step on the footplate with your toes on the edge so your heels can drop. Hold the bar at waist height (like the top of a deadlift) or at your chest. Raise up onto your toes, squeeze your calves, and lower your heels slowly.',
    workoutType: "B",
    phase: 3,
    phaseName: "X3 System – Pull Focus",
    phaseTimeRange: "20–35 Minutes",
    orderIndex: 4,
    defaultReps: "1 set to failure",
    isX3: true,
    isTimed: false,
  },
];

export function getExercisesForWorkout(workoutType: "A" | "B"): ExerciseDefinition[] {
  return EXERCISES.filter((e) => e.workoutType === workoutType);
}

export interface PhaseGroup {
  phase: number;
  phaseName: string;
  phaseTimeRange: string;
  exercises: ExerciseDefinition[];
}

export function getPhaseGroups(workoutType: "A" | "B"): PhaseGroup[] {
  const exercises = getExercisesForWorkout(workoutType);
  const phases: PhaseGroup[] = [];

  for (const exercise of exercises) {
    let phase = phases.find((p) => p.phase === exercise.phase);
    if (!phase) {
      phase = {
        phase: exercise.phase,
        phaseName: exercise.phaseName,
        phaseTimeRange: exercise.phaseTimeRange,
        exercises: [],
      };
      phases.push(phase);
    }
    phase.exercises.push(exercise);
  }

  phases.forEach((p) => p.exercises.sort((a, b) => a.orderIndex - b.orderIndex));
  return phases.sort((a, b) => a.phase - b.phase);
}
