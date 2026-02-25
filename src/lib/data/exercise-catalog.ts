// ============================================================================
// Exercise Catalog - Comprehensive exercise database
// ============================================================================
//
// This file contains the full catalog of exercises available in the app.
// Legacy exercises (from Workout A/B) are mapped via legacyId for backward
// compatibility. New exercises expand the catalog for custom workout building.
// ============================================================================

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export type ExerciseCategory =
  | "push"
  | "pull"
  | "legs"
  | "core"
  | "mobility"
  | "cardio"
  | "neck";

export type EquipmentType =
  | "bodyweight"
  | "dumbbell"
  | "barbell"
  | "band"
  | "machine"
  | "cable"
  | "kettlebell"
  | "x3"
  | "iron_neck";

export type TrackingType = "reps_weight" | "x3" | "reps_only" | "timed";

export interface CatalogExercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  primaryMuscles: string[];
  equipment: EquipmentType;
  trackingType: TrackingType;
  defaultSets: number;
  defaultReps: string;
  legacyId?: string;
}

// ---------------------------------------------------------------------------
// Exercise Catalog
// ---------------------------------------------------------------------------

export const EXERCISE_CATALOG: CatalogExercise[] = [
  // ==========================================================================
  // LEGACY EXERCISES - Workout A
  // ==========================================================================

  // -- Workout A, Phase 1: Posture & Mobility Warm-up -----------------------

  {
    id: "cat-cow",
    name: "Cat-Cow",
    description:
      "Get on all fours with wrists under shoulders and knees under hips. Inhale as you drop your belly and lift your chest (Cow), then exhale as you round your spine toward the ceiling and tuck your chin (Cat). Move slowly and synchronize each position with your breath.",
    category: "mobility",
    primaryMuscles: ["spine", "core"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "15",
    legacyId: "a-1-1",
  },
  {
    id: "wall-angels",
    name: "Wall Angels",
    description:
      "Stand with your heels, butt, upper back, and head pressed flat against a wall. Raise your arms to a goalpost position with elbows and wrists touching the wall, then slowly slide them up and down. Keep every point of contact glued to the wall throughout the entire range of motion.",
    category: "mobility",
    primaryMuscles: ["shoulders", "upper back", "thoracic spine"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "20",
    legacyId: "a-1-2",
  },
  {
    id: "band-pull-aparts",
    name: "Band Pull-Aparts",
    description:
      "Hold a light resistance band at chest height with arms extended straight in front of you. Keeping your arms straight, squeeze your shoulder blades together and pull the band apart until it touches your chest. Return to the start under control without letting the band snap back.",
    category: "mobility",
    primaryMuscles: ["rear delts", "rhomboids", "traps"],
    equipment: "band",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "20",
    legacyId: "a-1-3",
  },

  // -- Workout A, Phase 2: Iron Neck ----------------------------------------

  {
    id: "protraction-retraction",
    name: "Protraction & Retraction / Chin Tucks",
    description:
      "With the Iron Neck on and facing away from the anchor, push your head forward against the band resistance (protraction), then pull it straight back to create a double chin (retraction). Keep your shoulders completely still and isolate the movement to your neck.",
    category: "neck",
    primaryMuscles: ["deep cervical flexors", "neck extensors"],
    equipment: "iron_neck",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "15",
    legacyId: "a-2-1",
  },
  {
    id: "left-right-look",
    name: "Left & Right Look",
    description:
      "Stand with the Iron Neck anchor to your side so tension pulls laterally. Slowly turn your head to look over one shoulder, then the other, keeping your shoulders completely still. Switch the anchor side and repeat to train both directions evenly.",
    category: "neck",
    primaryMuscles: ["sternocleidomastoid", "neck rotators"],
    equipment: "iron_neck",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "15 per side",
    legacyId: "a-2-2",
  },
  {
    id: "isometric-holds",
    name: "Isometric Holds",
    description:
      "Step out from the anchor to create band tension. Hold your head perfectly straight and still against the resistance. Perform holds facing toward the anchor, away from it, and with the anchor to each side, maintaining a neutral neck position throughout.",
    category: "neck",
    primaryMuscles: ["neck flexors", "neck extensors", "lateral neck muscles"],
    equipment: "iron_neck",
    trackingType: "timed",
    defaultSets: 1,
    defaultReps: "30 sec each direction",
    legacyId: "a-2-3",
  },

  // -- Workout A, Phase 3: X3 Push -------------------------------------------

  {
    id: "x3-front-squat",
    name: "Front Squat",
    description:
      "Step on the X3 footplate with the band looped under it and over the bar. Bring the bar up to your collarbone, resting it on the front of your shoulders. Squat down while keeping your chest up and elbows high, then stand back up to near-lockout without fully locking your knees.",
    category: "legs",
    primaryMuscles: ["quads", "glutes", "core"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "a-3-1",
  },
  {
    id: "x3-chest-press",
    name: "Chest Press",
    description:
      "Wrap the X3 band around your back and grasp the bar at chest height. Push the bar straight out in front of your chest, maintaining a slight bend at the elbows at full extension. Lower the bar back slowly, keeping constant tension on your chest muscles.",
    category: "push",
    primaryMuscles: ["chest", "triceps", "front delts"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "a-3-2",
  },
  {
    id: "x3-overhead-press",
    name: "Overhead Press",
    description:
      "Step on the X3 band and bring the bar to your upper chest. Press the bar straight overhead until your arms are fully extended, keeping your core braced to avoid arching your lower back. Lower the bar back to your collarbone in a controlled manner.",
    category: "push",
    primaryMuscles: ["shoulders", "triceps", "upper chest"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "a-3-3",
  },
  {
    id: "x3-triceps-press",
    name: "Triceps Press",
    description:
      "Step on the X3 band and lean slightly forward. Hold the bar with an overhand grip at chest level, keeping your elbows pinned firmly to your ribs. Press the bar straight down toward your thighs by extending only at the elbow, then return slowly to the start.",
    category: "push",
    primaryMuscles: ["triceps"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "a-3-4",
  },

  // ==========================================================================
  // LEGACY EXERCISES - Workout B
  // ==========================================================================

  // -- Workout B, Phase 1: Posture & Core Warm-up ----------------------------

  {
    id: "plank",
    name: "Plank",
    description:
      "Support your weight on your forearms and toes with elbows directly under your shoulders. Keep your body in a perfectly straight line from head to heels by squeezing your glutes and bracing your core. Avoid letting your hips sag or pike up during the hold.",
    category: "core",
    primaryMuscles: ["abs", "obliques", "lower back"],
    equipment: "bodyweight",
    trackingType: "timed",
    defaultSets: 1,
    defaultReps: "60 sec",
    legacyId: "b-1-1",
  },
  {
    id: "glute-bridges",
    name: "Glute Bridges",
    description:
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart. Drive through your heels to lift your hips toward the ceiling until your body forms a straight line from knees to shoulders. Squeeze your glutes hard at the top for two seconds before lowering back down.",
    category: "legs",
    primaryMuscles: ["glutes", "hamstrings"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "20",
    legacyId: "b-1-2",
  },
  {
    id: "bird-dog",
    name: "Bird-Dog",
    description:
      "Start on all fours with wrists under shoulders and knees under hips. Extend your right arm straight forward and left leg straight back simultaneously while keeping your back completely flat. Hold briefly, return to the start, then switch to the opposite arm and leg.",
    category: "core",
    primaryMuscles: ["core", "lower back", "glutes"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "10 per side",
    legacyId: "b-1-3",
  },

  // -- Workout B, Phase 2: Iron Neck Rotational ------------------------------

  {
    id: "360-spins",
    name: "360 Spins",
    description:
      "With the Iron Neck on, step away from the anchor to create moderate tension. Slowly walk in a complete, controlled circle while keeping your head and neck perfectly aligned and stable against the band pull. Repeat in the opposite direction for balanced training.",
    category: "neck",
    primaryMuscles: ["neck stabilizers", "traps", "sternocleidomastoid"],
    equipment: "iron_neck",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "5 each way",
    legacyId: "b-2-1",
  },
  {
    id: "figure-eights",
    name: "Figure Eights",
    description:
      "Face away from the Iron Neck anchor and use your nose as a pointer to slowly trace a large figure-eight pattern in the air. Keep the movement strictly in your neck, not your torso, and maintain smooth, controlled transitions at each loop of the eight.",
    category: "neck",
    primaryMuscles: ["neck rotators", "neck flexors", "neck extensors"],
    equipment: "iron_neck",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "10",
    legacyId: "b-2-2",
  },
  {
    id: "diagonals",
    name: "Diagonals",
    description:
      "Stand with the Iron Neck anchor behind you. Look down toward your left hip, then trace a smooth diagonal line up toward the ceiling on your right side. Complete all reps on that diagonal, then switch to the down-right/up-left diagonal for balanced training.",
    category: "neck",
    primaryMuscles: ["neck lateral flexors", "neck rotators", "traps"],
    equipment: "iron_neck",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "10 per side",
    legacyId: "b-2-3",
  },

  // -- Workout B, Phase 3: X3 Pull -------------------------------------------

  {
    id: "x3-deadlift",
    name: "Deadlift",
    description:
      "Step on the X3 footplate with the band looped underneath. Hinge at your hips, grab the bar with a shoulder-width grip, and keep your back completely flat. Stand up by driving through your legs and thrusting your hips slightly forward at the top.",
    category: "pull",
    primaryMuscles: ["hamstrings", "glutes", "lower back", "traps"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "b-3-1",
  },
  {
    id: "x3-bent-over-row",
    name: "Bent-Over Row",
    description:
      "Step on the X3 band and hinge forward at roughly a 45-degree angle with a flat back. Let the bar hang straight down, then pull it firmly up toward your belly button, squeezing your shoulder blades together at the top. Lower the bar slowly and under control.",
    category: "pull",
    primaryMuscles: ["lats", "rhomboids", "biceps", "rear delts"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "b-3-2",
  },
  {
    id: "x3-bicep-curl",
    name: "Bicep Curl",
    description:
      "Step on the X3 band and hold the bar with an underhand (supinated) grip. Keep your elbows locked at your sides and curl the bar up toward your shoulders by flexing only at the elbow. Lower the bar slowly, resisting the band tension on the way down.",
    category: "pull",
    primaryMuscles: ["biceps", "forearms"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "b-3-3",
  },
  {
    id: "x3-calf-raise",
    name: "Calf Raise",
    description:
      "Stand on the X3 footplate with your toes on the edge so your heels can drop. Hold the bar at waist height or chest height for added resistance. Rise up onto your toes, squeeze your calves hard at the top, then lower your heels slowly below the plate level.",
    category: "legs",
    primaryMuscles: ["calves"],
    equipment: "x3",
    trackingType: "x3",
    defaultSets: 1,
    defaultReps: "to failure",
    legacyId: "b-3-4",
  },

  // ==========================================================================
  // NEW EXERCISES - Push
  // ==========================================================================

  {
    id: "bb-bench-press",
    name: "Barbell Bench Press",
    description:
      "Lie on a flat bench with your eyes under the bar. Grip the bar slightly wider than shoulder width, unrack it, and lower it to your mid-chest with elbows at roughly 45 degrees. Press the bar back up in a slight arc toward your eyes, keeping your shoulder blades pinched and feet flat on the floor.",
    category: "push",
    primaryMuscles: ["chest", "triceps", "shoulders"],
    equipment: "barbell",
    trackingType: "reps_weight",
    defaultSets: 4,
    defaultReps: "5-8",
  },
  {
    id: "db-bench-press",
    name: "Dumbbell Bench Press",
    description:
      "Lie on a flat bench holding a dumbbell in each hand at chest level. Press both dumbbells up until your arms are extended, allowing them to converge slightly at the top. Lower the dumbbells with control until they are level with your chest, keeping your elbows at a 45-degree angle.",
    category: "push",
    primaryMuscles: ["chest", "triceps"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "incline-db-press",
    name: "Incline Dumbbell Press",
    description:
      "Set an adjustable bench to a 30-45 degree incline. Press the dumbbells up from shoulder level until your arms are extended, squeezing your upper chest at the top. Lower the weights slowly, keeping your elbows angled slightly below your shoulders to protect the joint.",
    category: "push",
    primaryMuscles: ["upper chest", "shoulders"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "db-shoulder-press",
    name: "Dumbbell Shoulder Press",
    description:
      "Sit or stand with a dumbbell in each hand at shoulder height, palms facing forward. Press both dumbbells overhead until your arms are fully extended without locking your elbows. Lower the weights back to shoulder level under control, keeping your core braced to prevent arching.",
    category: "push",
    primaryMuscles: ["shoulders", "triceps"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "dips",
    name: "Dips",
    description:
      "Grip parallel bars and support your body with arms fully extended. Lower yourself by bending your elbows until your upper arms are roughly parallel to the floor, leaning slightly forward to target your chest. Push yourself back up to full arm extension without swinging or kipping.",
    category: "push",
    primaryMuscles: ["chest", "triceps"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "8-15",
  },
  {
    id: "push-ups",
    name: "Push-ups",
    description:
      "Start in a high plank with hands slightly wider than shoulder width and body in a straight line. Lower your chest to the floor by bending your elbows to about 90 degrees, keeping them at a 45-degree angle to your body. Push back up to the start, fully extending your arms without sagging your hips.",
    category: "push",
    primaryMuscles: ["chest", "triceps", "shoulders"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "15-25",
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    description:
      "Stand with a dumbbell in each hand at your sides, palms facing inward. Raise both arms out to the sides until they are parallel with the floor, leading with your elbows rather than your wrists. Lower the weights slowly, avoiding momentum and keeping a slight bend in your elbows throughout.",
    category: "push",
    primaryMuscles: ["shoulders"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "12-15",
  },
  {
    id: "cable-fly",
    name: "Cable Fly",
    description:
      "Set the cable pulleys to chest height and grab a handle in each hand. Step forward into a staggered stance with a slight forward lean. Bring both handles together in a wide arc in front of your chest, squeezing your pecs at the midline, then return slowly with arms slightly bent.",
    category: "push",
    primaryMuscles: ["chest"],
    equipment: "cable",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-15",
  },
  {
    id: "db-tricep-ext",
    name: "Dumbbell Tricep Extension",
    description:
      "Hold a single dumbbell with both hands overhead, arms fully extended. Lower the weight behind your head by bending only at the elbows, keeping your upper arms vertical and close to your ears. Extend your arms back to the top, squeezing your triceps at full lockout.",
    category: "push",
    primaryMuscles: ["triceps"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-12",
  },

  // ==========================================================================
  // NEW EXERCISES - Pull
  // ==========================================================================

  {
    id: "pull-ups",
    name: "Pull-ups",
    description:
      "Hang from a bar with an overhand grip slightly wider than shoulder width and arms fully extended. Pull yourself up until your chin clears the bar by driving your elbows down and back. Lower yourself under control to a full dead hang before starting the next rep.",
    category: "pull",
    primaryMuscles: ["back", "biceps"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "5-12",
  },
  {
    id: "chin-ups",
    name: "Chin-ups",
    description:
      "Hang from a bar with an underhand (supinated) grip at shoulder width and arms fully extended. Pull yourself up until your chin clears the bar, focusing on squeezing your biceps and lats. Lower yourself all the way back to a dead hang in a controlled manner.",
    category: "pull",
    primaryMuscles: ["biceps", "back"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "5-12",
  },
  {
    id: "bb-row",
    name: "Barbell Row",
    description:
      "Stand with feet hip-width apart, hinge forward at the hips to about 45 degrees while keeping your back flat. Grip the barbell slightly wider than shoulder width and pull it into your lower chest or upper abdomen, squeezing your shoulder blades together at the top. Lower the bar under control without rounding your back.",
    category: "pull",
    primaryMuscles: ["back", "biceps"],
    equipment: "barbell",
    trackingType: "reps_weight",
    defaultSets: 4,
    defaultReps: "6-10",
  },
  {
    id: "db-row",
    name: "Dumbbell Row",
    description:
      "Place one knee and hand on a bench for support, keeping your back flat and parallel to the floor. Hold a dumbbell in your free hand with arm extended. Row the dumbbell up to your hip by driving your elbow toward the ceiling, squeezing your lat at the top before lowering slowly.",
    category: "pull",
    primaryMuscles: ["back", "biceps"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    description:
      "Sit at the lat pulldown machine with thighs secured under the pads. Grip the bar wider than shoulder width with an overhand grip. Pull the bar down to your upper chest by driving your elbows down and slightly back, squeezing your lats, then return the bar up with control.",
    category: "pull",
    primaryMuscles: ["back", "biceps"],
    equipment: "machine",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "cable-row",
    name: "Seated Cable Row",
    description:
      "Sit at the cable row station with feet on the footpads and knees slightly bent. Grab the handle with both hands and pull it toward your lower chest, squeezing your shoulder blades together at the end of the pull. Return the handle forward with control, letting your shoulders stretch slightly without rounding your back.",
    category: "pull",
    primaryMuscles: ["back", "biceps"],
    equipment: "cable",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-12",
  },
  {
    id: "face-pull",
    name: "Face Pull",
    description:
      "Set a cable pulley to upper chest height with a rope attachment. Pull the rope toward your face by driving your elbows wide and high, externally rotating your shoulders so your fists end up beside your ears. Squeeze your rear delts and upper back at the peak contraction before returning slowly.",
    category: "pull",
    primaryMuscles: ["rear delts", "traps"],
    equipment: "cable",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "15-20",
  },
  {
    id: "db-shrug",
    name: "Dumbbell Shrug",
    description:
      "Stand holding a dumbbell in each hand at your sides with arms fully extended. Shrug your shoulders straight up toward your ears as high as possible, squeezing your traps at the top for a one-second hold. Lower your shoulders back down slowly without rolling them forward or backward.",
    category: "pull",
    primaryMuscles: ["traps"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "12-15",
  },
  {
    id: "db-bicep-curl",
    name: "Dumbbell Bicep Curl",
    description:
      "Stand with a dumbbell in each hand, arms at your sides, palms facing forward. Curl both dumbbells up toward your shoulders by bending at the elbows while keeping your upper arms stationary. Lower the weights back down under control, fully extending your arms at the bottom.",
    category: "pull",
    primaryMuscles: ["biceps"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-12",
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    description:
      "Stand holding dumbbells at your sides with palms facing each other in a neutral grip. Curl both weights up toward your shoulders, keeping the neutral wrist position throughout the movement. Lower under control, avoiding any swinging of the torso to maintain strict form.",
    category: "pull",
    primaryMuscles: ["biceps", "forearms"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-12",
  },

  // ==========================================================================
  // NEW EXERCISES - Legs
  // ==========================================================================

  {
    id: "bb-squat",
    name: "Barbell Back Squat",
    description:
      "Position the barbell across your upper traps, unrack it, and step back into a shoulder-width stance with toes slightly out. Squat down by pushing your hips back and bending your knees until your thighs are at least parallel to the floor. Drive through your whole foot to stand back up, keeping your chest up and core braced throughout.",
    category: "legs",
    primaryMuscles: ["quads", "glutes", "hamstrings"],
    equipment: "barbell",
    trackingType: "reps_weight",
    defaultSets: 4,
    defaultReps: "5-8",
  },
  {
    id: "db-lunges",
    name: "Dumbbell Lunges",
    description:
      "Hold a dumbbell in each hand at your sides. Step forward with one foot and lower your body until both knees form roughly 90-degree angles, keeping your front knee tracking over your toes. Push through your front foot to return to standing, then repeat on the other leg.",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10 per side",
  },
  {
    id: "rdl",
    name: "Romanian Deadlift",
    description:
      "Hold a barbell at hip height with a shoulder-width grip and slight bend in your knees. Hinge at the hips and push them back as you lower the bar along your legs, keeping it close to your body. Go down until you feel a strong stretch in your hamstrings, then drive your hips forward to return to standing.",
    category: "legs",
    primaryMuscles: ["hamstrings", "glutes"],
    equipment: "barbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "hip-thrust",
    name: "Barbell Hip Thrust",
    description:
      "Sit on the floor with your upper back against a bench and a barbell across your hips, using a pad for comfort. Plant your feet flat on the floor at hip width. Drive through your heels to thrust your hips up until your body forms a straight line from shoulders to knees, squeezing your glutes hard at the top.",
    category: "legs",
    primaryMuscles: ["glutes", "hamstrings"],
    equipment: "barbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    description:
      "Sit in the leg press machine with your back flat against the pad and feet placed shoulder-width apart on the platform. Lower the platform by bending your knees toward your chest until they reach about 90 degrees. Press the platform back up by extending your legs without fully locking your knees at the top.",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: "machine",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-15",
  },
  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    description:
      "Stand a couple of feet in front of a bench and place the top of one foot on the bench behind you. Hold dumbbells at your sides and lower your body by bending your front knee until your rear knee nearly touches the floor. Drive through your front foot to stand back up, keeping your torso upright throughout.",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "8-12 per side",
  },
  {
    id: "leg-curl",
    name: "Lying Leg Curl",
    description:
      "Lie face down on the leg curl machine with the pad resting just above your ankles and your knees aligned with the machine pivot point. Curl your heels toward your glutes by contracting your hamstrings, squeezing at the top. Lower the weight slowly back to the start without letting it slam the stack.",
    category: "legs",
    primaryMuscles: ["hamstrings"],
    equipment: "machine",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-12",
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    description:
      "Sit in the leg extension machine with your back against the pad and the roller pad on your shins just above your ankles. Extend your legs by straightening your knees until your legs are fully extended, squeezing your quads at the top. Lower the weight slowly under control without letting it drop.",
    category: "legs",
    primaryMuscles: ["quads"],
    equipment: "machine",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-15",
  },
  {
    id: "db-calf-raise",
    name: "Dumbbell Calf Raise",
    description:
      "Stand on the edge of a step or raised platform with the balls of your feet, holding dumbbells at your sides. Lower your heels below the step for a full stretch, then rise up as high as possible onto your toes. Squeeze your calves at the top and hold for one second before lowering slowly.",
    category: "legs",
    primaryMuscles: ["calves"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "15-20",
  },
  {
    id: "goblet-squat",
    name: "Goblet Squat",
    description:
      "Hold a dumbbell vertically against your chest, cupping the top end with both hands. Stand with feet slightly wider than shoulder width, toes pointed slightly out. Squat down by sitting back and spreading your knees over your toes, going as deep as your mobility allows while keeping your chest tall and elbows inside your knees.",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: "dumbbell",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10-15",
  },

  // ==========================================================================
  // NEW EXERCISES - Core
  // ==========================================================================

  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    description:
      "Hang from a pull-up bar with arms fully extended and shoulders engaged. Raise your legs in front of you by flexing at the hips, keeping them as straight as possible until they are parallel to the floor or higher. Lower your legs slowly back to the hanging position without swinging.",
    category: "core",
    primaryMuscles: ["abs", "hip flexors"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "10-15",
  },
  {
    id: "ab-wheel",
    name: "Ab Wheel Rollout",
    description:
      "Kneel on the floor holding an ab wheel with both hands. Roll the wheel forward by extending your arms and hips, lowering your chest toward the floor while keeping your core braced and back flat. Pull the wheel back toward your knees by contracting your abs, stopping before your hips flex past neutral.",
    category: "core",
    primaryMuscles: ["abs", "shoulders"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "8-12",
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    description:
      "Sit on the floor with knees bent, feet slightly off the ground, and lean back to about 45 degrees. Clasp your hands together or hold a weight at chest level. Rotate your torso to one side, tapping the floor beside your hip, then rotate to the other side in a controlled manner.",
    category: "core",
    primaryMuscles: ["obliques", "abs"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "20",
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    description:
      "Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees above your hips. Slowly extend one arm overhead and the opposite leg toward the floor simultaneously, keeping your lower back pressed firmly into the ground. Return to the start and repeat on the other side.",
    category: "core",
    primaryMuscles: ["core", "stability"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 3,
    defaultReps: "10 per side",
  },
  {
    id: "pallof-press",
    name: "Pallof Press",
    description:
      "Stand perpendicular to a cable machine with the handle at chest height. Hold the handle at your chest with both hands. Press it straight out in front of you, resisting the cable's pull to rotate your torso. Hold briefly with arms extended, then bring the handle back to your chest.",
    category: "core",
    primaryMuscles: ["core", "anti-rotation"],
    equipment: "cable",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "10 per side",
  },
  {
    id: "cable-crunch",
    name: "Cable Crunch",
    description:
      "Kneel in front of a high cable pulley, holding the rope attachment behind your head. Crunch downward by flexing your spine and pulling your elbows toward your knees, focusing on contracting your abs rather than pulling with your arms. Return to the upright kneeling position under control.",
    category: "core",
    primaryMuscles: ["abs"],
    equipment: "cable",
    trackingType: "reps_weight",
    defaultSets: 3,
    defaultReps: "12-15",
  },
  {
    id: "side-plank",
    name: "Side Plank",
    description:
      "Lie on your side and prop yourself up on your forearm with your elbow directly under your shoulder. Stack your feet and lift your hips off the ground to form a straight line from head to feet. Hold this position, bracing your obliques and keeping your hips from sagging, then switch sides.",
    category: "core",
    primaryMuscles: ["obliques"],
    equipment: "bodyweight",
    trackingType: "timed",
    defaultSets: 3,
    defaultReps: "30 sec per side",
  },

  // ==========================================================================
  // NEW EXERCISES - Mobility
  // ==========================================================================

  {
    id: "foam-roll",
    name: "Foam Rolling",
    description:
      "Place a foam roller under the target muscle group and use your body weight to apply pressure. Roll slowly back and forth along the muscle, pausing on any tender spots for 20-30 seconds. Cover all major muscle groups including quads, hamstrings, glutes, upper back, and lats.",
    category: "mobility",
    primaryMuscles: ["full body"],
    equipment: "bodyweight",
    trackingType: "timed",
    defaultSets: 1,
    defaultReps: "5 min",
  },
  {
    id: "hip-circles",
    name: "Hip Circles",
    description:
      "Stand on one leg and lift the other knee to hip height. Make large, controlled circles with your knee, rotating from the hip joint. Complete all reps in one direction, then reverse the circle, before switching to the other leg.",
    category: "mobility",
    primaryMuscles: ["hips"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "10 each way",
  },
  {
    id: "shoulder-dislocates",
    name: "Shoulder Dislocates",
    description:
      "Hold a resistance band or dowel with a wide overhand grip in front of your thighs. Keeping your arms straight, slowly raise it overhead and continue the arc until the band or dowel reaches behind your back near your glutes. Reverse the movement to return to the front, using a grip width that allows smooth motion without pain.",
    category: "mobility",
    primaryMuscles: ["shoulders"],
    equipment: "band",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "15",
  },
  {
    id: "world-greatest-stretch",
    name: "World's Greatest Stretch",
    description:
      "Step into a deep lunge, place the hand opposite your front foot on the ground, then rotate your torso and reach your other arm toward the ceiling. Hold the rotation for a breath, then bring your elbow down toward the instep of your front foot. Repeat on the other side for balanced hip, thoracic, and hamstring mobility.",
    category: "mobility",
    primaryMuscles: ["full body"],
    equipment: "bodyweight",
    trackingType: "reps_only",
    defaultSets: 1,
    defaultReps: "5 per side",
  },

  // ==========================================================================
  // NEW EXERCISES - Cardio
  // ==========================================================================

  {
    id: "jump-rope",
    name: "Jump Rope",
    description:
      "Hold the rope handles at hip height with elbows close to your sides. Rotate the rope with your wrists, not your arms, and jump just high enough to clear it, landing softly on the balls of your feet. Keep your core tight and maintain a consistent rhythm, bouncing on both feet simultaneously.",
    category: "cardio",
    primaryMuscles: ["full body"],
    equipment: "bodyweight",
    trackingType: "timed",
    defaultSets: 3,
    defaultReps: "60 sec",
  },
  {
    id: "rowing",
    name: "Rowing Machine",
    description:
      "Sit on the rower with feet strapped in and knees bent. Push back with your legs first, then lean your torso back slightly and pull the handle to your lower chest. Return by extending your arms, leaning forward, and bending your knees in that order. Maintain a smooth, powerful stroke cadence.",
    category: "cardio",
    primaryMuscles: ["full body"],
    equipment: "machine",
    trackingType: "timed",
    defaultSets: 1,
    defaultReps: "10 min",
  },
];

// ---------------------------------------------------------------------------
// Legacy ID Mapping
// ---------------------------------------------------------------------------

/** Maps old exercise IDs (e.g., "a-1-1") to new catalog IDs (e.g., "cat-cow") */
export const LEGACY_TO_CATALOG: Record<string, string> = {
  "a-1-1": "cat-cow",
  "a-1-2": "wall-angels",
  "a-1-3": "band-pull-aparts",
  "a-2-1": "protraction-retraction",
  "a-2-2": "left-right-look",
  "a-2-3": "isometric-holds",
  "a-3-1": "x3-front-squat",
  "a-3-2": "x3-chest-press",
  "a-3-3": "x3-overhead-press",
  "a-3-4": "x3-triceps-press",
  "b-1-1": "plank",
  "b-1-2": "glute-bridges",
  "b-1-3": "bird-dog",
  "b-2-1": "360-spins",
  "b-2-2": "figure-eights",
  "b-2-3": "diagonals",
  "b-3-1": "x3-deadlift",
  "b-3-2": "x3-bent-over-row",
  "b-3-3": "x3-bicep-curl",
  "b-3-4": "x3-calf-raise",
};

/** Maps new catalog IDs back to old legacy IDs */
export const CATALOG_TO_LEGACY: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_TO_CATALOG).map(([legacy, catalog]) => [catalog, legacy])
);

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Look up a single exercise by its catalog ID.
 * Also checks legacyId fields, so you can pass either a new ID or legacy ID.
 */
export function getCatalogExercise(id: string): CatalogExercise | undefined {
  // Direct ID match
  const direct = EXERCISE_CATALOG.find((e) => e.id === id);
  if (direct) return direct;

  // Try resolving a legacy ID to a catalog ID
  const catalogId = LEGACY_TO_CATALOG[id];
  if (catalogId) {
    return EXERCISE_CATALOG.find((e) => e.id === catalogId);
  }

  return undefined;
}

/** Get all exercises in a given category. */
export function getCatalogByCategory(category: ExerciseCategory): CatalogExercise[] {
  return EXERCISE_CATALOG.filter((e) => e.category === category);
}

/** Get all exercises that use a specific equipment type. */
export function getCatalogByEquipment(equipment: EquipmentType): CatalogExercise[] {
  return EXERCISE_CATALOG.filter((e) => e.equipment === equipment);
}

/** Search the catalog by name, description, or muscle group (case-insensitive). */
export function searchCatalog(query: string): CatalogExercise[] {
  const lower = query.toLowerCase();
  return EXERCISE_CATALOG.filter(
    (e) =>
      e.name.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.primaryMuscles.some((m) => m.toLowerCase().includes(lower)) ||
      e.id.toLowerCase().includes(lower)
  );
}
