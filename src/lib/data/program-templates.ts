// ---------------------------------------------------------------------------
// Program Templates – preset workout programs users can pick in the builder
// ---------------------------------------------------------------------------

export interface ProgramExercise {
  catalogId: string; // References EXERCISE_CATALOG[].id
  targetSets: number;
  targetReps: string; // e.g., "8-12", "to failure", "60 sec"
}

export interface WorkoutSection {
  name: string;
  exercises: ProgramExercise[];
}

export interface WorkoutDay {
  name: string;
  sections: WorkoutSection[];
}

export type ProgramSchedule = Record<string, "rest" | WorkoutDay>;

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  schedule: ProgramSchedule;
}

// ---------------------------------------------------------------------------
// Helper – keeps the long literal a bit more readable
// ---------------------------------------------------------------------------
function ex(catalogId: string, targetSets: number, targetReps: string): ProgramExercise {
  return { catalogId, targetSets, targetReps };
}

// ---------------------------------------------------------------------------
// Template 1 – Default A/B Rotation (mirrors the original hardcoded program)
// ---------------------------------------------------------------------------

const workoutA: WorkoutDay = {
  name: "Push & Posture",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("cat-cow", 1, "15"),
        ex("wall-angels", 1, "20"),
        ex("band-pull-aparts", 1, "20"),
      ],
    },
    {
      name: "Iron Neck",
      exercises: [
        ex("protraction-retraction", 1, "15"),
        ex("left-right-look", 1, "15 per side"),
        ex("isometric-holds", 1, "30 sec each direction"),
      ],
    },
    {
      name: "X3 Push",
      exercises: [
        ex("x3-front-squat", 1, "to failure"),
        ex("x3-chest-press", 1, "to failure"),
        ex("x3-overhead-press", 1, "to failure"),
        ex("x3-triceps-press", 1, "to failure"),
      ],
    },
  ],
};

// Workout A without Iron Neck (for non-neck days)
const workoutAPush: WorkoutDay = {
  name: "Push",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("cat-cow", 1, "15"),
        ex("wall-angels", 1, "20"),
        ex("band-pull-aparts", 1, "20"),
      ],
    },
    {
      name: "X3 Push",
      exercises: [
        ex("x3-front-squat", 1, "to failure"),
        ex("x3-chest-press", 1, "to failure"),
        ex("x3-overhead-press", 1, "to failure"),
        ex("x3-triceps-press", 1, "to failure"),
      ],
    },
  ],
};

const workoutB: WorkoutDay = {
  name: "Pull & Core",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("plank", 1, "60 sec"),
        ex("glute-bridges", 1, "20"),
        ex("bird-dog", 1, "10 per side"),
      ],
    },
    {
      name: "Iron Neck",
      exercises: [
        ex("360-spins", 1, "5 each way"),
        ex("figure-eights", 1, "10"),
        ex("diagonals", 1, "10 per side"),
      ],
    },
    {
      name: "X3 Pull",
      exercises: [
        ex("x3-deadlift", 1, "to failure"),
        ex("x3-bent-over-row", 1, "to failure"),
        ex("x3-bicep-curl", 1, "to failure"),
        ex("x3-calf-raise", 1, "to failure"),
      ],
    },
  ],
};

// Workout B without Iron Neck (for non-neck days)
const workoutBPull: WorkoutDay = {
  name: "Pull & Core",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("plank", 1, "60 sec"),
        ex("glute-bridges", 1, "20"),
        ex("bird-dog", 1, "10 per side"),
      ],
    },
    {
      name: "X3 Pull",
      exercises: [
        ex("x3-deadlift", 1, "to failure"),
        ex("x3-bent-over-row", 1, "to failure"),
        ex("x3-bicep-curl", 1, "to failure"),
        ex("x3-calf-raise", 1, "to failure"),
      ],
    },
  ],
};

// Schedule: Iron Neck on Mon, Wed, Thu, Sat = 4x/week
// Neck-free days (Tue, Fri) provide recovery between sessions
const defaultABRotation: ProgramTemplate = {
  id: "default-ab-rotation",
  name: "Default A/B Rotation",
  description:
    "X3 + Iron Neck program. 6 days/week alternating push and pull, with 4 Iron Neck sessions spaced for recovery.",
  daysPerWeek: 6,
  schedule: {
    "0": "rest",
    "1": workoutA,      // Mon: Push + Neck (isometrics)
    "2": workoutBPull,  // Tue: Pull (no neck – recovery)
    "3": workoutA,      // Wed: Push + Neck (isometrics)
    "4": workoutB,      // Thu: Pull + Neck (rotational)
    "5": workoutAPush,  // Fri: Push (no neck – recovery)
    "6": workoutB,      // Sat: Pull + Neck (rotational)
  },
};

// ---------------------------------------------------------------------------
// Template 2 – Push / Pull / Legs
// ---------------------------------------------------------------------------

const pplPushDay: WorkoutDay = {
  name: "Push",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("cat-cow", 1, "15"),
        ex("wall-angels", 1, "20"),
      ],
    },
    {
      name: "Main Lifts",
      exercises: [
        ex("bb-bench-press", 4, "5-8"),
        ex("db-shoulder-press", 3, "8-12"),
      ],
    },
    {
      name: "Accessories",
      exercises: [
        ex("incline-db-press", 3, "8-12"),
        ex("lateral-raise", 3, "12-15"),
        ex("db-tricep-ext", 3, "10-12"),
      ],
    },
  ],
};

const pplPullDay: WorkoutDay = {
  name: "Pull",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("band-pull-aparts", 1, "20"),
        ex("dead-bug", 3, "10 per side"),
      ],
    },
    {
      name: "Main Lifts",
      exercises: [
        ex("bb-row", 4, "6-10"),
        ex("pull-ups", 3, "5-12"),
      ],
    },
    {
      name: "Accessories",
      exercises: [
        ex("cable-row", 3, "10-12"),
        ex("face-pull", 3, "15-20"),
        ex("db-bicep-curl", 3, "10-12"),
      ],
    },
  ],
};

const pplLegsDay: WorkoutDay = {
  name: "Legs",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("hip-circles", 1, "15"),
        ex("glute-bridges", 1, "20"),
      ],
    },
    {
      name: "Main Lifts",
      exercises: [
        ex("bb-squat", 4, "5-8"),
        ex("rdl", 3, "8-12"),
      ],
    },
    {
      name: "Accessories",
      exercises: [
        ex("bulgarian-split-squat", 3, "8-12 per side"),
        ex("leg-curl", 3, "10-12"),
        ex("db-calf-raise", 3, "15-20"),
      ],
    },
  ],
};

const pushPullLegs: ProgramTemplate = {
  id: "push-pull-legs",
  name: "Push / Pull / Legs",
  description:
    "Classic 5-day push/pull/legs split. Great for building strength and size.",
  daysPerWeek: 5,
  schedule: {
    "0": "rest",
    "1": pplPushDay,
    "2": pplPullDay,
    "3": "rest",
    "4": pplLegsDay,
    "5": pplPushDay,
    "6": pplPullDay,
  },
};

// ---------------------------------------------------------------------------
// Template 3 – Upper / Lower
// ---------------------------------------------------------------------------

const ulUpperDay: WorkoutDay = {
  name: "Upper",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("cat-cow", 1, "15"),
        ex("band-pull-aparts", 1, "20"),
      ],
    },
    {
      name: "Push",
      exercises: [
        ex("db-bench-press", 3, "8-12"),
        ex("db-shoulder-press", 3, "8-12"),
      ],
    },
    {
      name: "Pull",
      exercises: [
        ex("db-row", 3, "8-12"),
        ex("lat-pulldown", 3, "8-12"),
      ],
    },
    {
      name: "Arms",
      exercises: [
        ex("db-bicep-curl", 2, "10-12"),
        ex("db-tricep-ext", 2, "10-12"),
      ],
    },
  ],
};

const ulLowerDay: WorkoutDay = {
  name: "Lower",
  sections: [
    {
      name: "Warm-up",
      exercises: [
        ex("hip-circles", 1, "15"),
        ex("glute-bridges", 1, "20"),
      ],
    },
    {
      name: "Main Lifts",
      exercises: [
        ex("goblet-squat", 3, "10-15"),
        ex("rdl", 3, "8-12"),
      ],
    },
    {
      name: "Accessories",
      exercises: [
        ex("db-lunges", 3, "10 per side"),
        ex("leg-curl", 3, "10-12"),
      ],
    },
    {
      name: "Core",
      exercises: [
        ex("plank", 3, "60 sec"),
        ex("russian-twist", 3, "20"),
      ],
    },
  ],
};

const upperLower: ProgramTemplate = {
  id: "upper-lower",
  name: "Upper / Lower",
  description:
    "4-day upper/lower split. Balanced strength with built-in recovery.",
  daysPerWeek: 4,
  schedule: {
    "0": "rest",
    "1": ulUpperDay,
    "2": ulLowerDay,
    "3": "rest",
    "4": ulUpperDay,
    "5": ulLowerDay,
    "6": "rest",
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  defaultABRotation,
  pushPullLegs,
  upperLower,
];
