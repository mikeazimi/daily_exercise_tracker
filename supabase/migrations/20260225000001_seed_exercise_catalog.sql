-- Migration: Seed Exercise Catalog
-- Inserts ~40 general-purpose exercises into exercise_definitions.
-- These are not bound to the A/B workout system (workout_type, phase, etc. are NULL).
-- Uses ON CONFLICT (id) DO NOTHING for idempotency.

-- ============================================================================
-- Push exercises
-- ============================================================================
INSERT INTO public.exercise_definitions
  (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed)
VALUES
  ('bb-bench-press', 'Barbell Bench Press', 'Lie flat on a bench with feet on the floor. Grip the barbell slightly wider than shoulder width. Lower the bar to your mid-chest, then press it back up to full arm extension.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('db-bench-press', 'Dumbbell Bench Press', 'Lie flat on a bench holding a dumbbell in each hand at chest level. Press the dumbbells up until your arms are extended, then lower them back to chest height with control.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('incline-db-press', 'Incline Dumbbell Press', 'Set the bench to a 30-45 degree incline. Hold a dumbbell in each hand at shoulder level. Press the dumbbells up and slightly together, then lower them back down with control.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('db-shoulder-press', 'Dumbbell Shoulder Press', 'Sit or stand holding dumbbells at shoulder height with palms facing forward. Press the weights overhead until your arms are fully extended, then lower them back to shoulder level.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('dips', 'Dips', 'Grip parallel bars and support your body with arms extended. Lower yourself by bending your elbows until your upper arms are roughly parallel to the floor, then push back up.', NULL, NULL, NULL, NULL, NULL, '8-15 reps', false, false),
  ('push-ups', 'Push-Ups', 'Start in a high plank position with hands slightly wider than shoulder width. Lower your chest to the floor by bending your elbows, then push back up to the starting position.', NULL, NULL, NULL, NULL, NULL, '15-25 reps', false, false),
  ('lateral-raise', 'Lateral Raise', 'Stand holding light dumbbells at your sides. Raise your arms out to the sides until they are parallel to the floor, keeping a slight bend in the elbows. Lower slowly.', NULL, NULL, NULL, NULL, NULL, '12-15 reps', false, false),
  ('cable-fly', 'Cable Fly', 'Stand in the center of a cable crossover machine with handles set at chest height. With a slight bend in your elbows, bring your hands together in front of your chest in an arc motion.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false),
  ('db-tricep-ext', 'Dumbbell Tricep Extension', 'Hold a dumbbell overhead with both hands gripping one end. Keep your upper arms close to your ears and lower the weight behind your head by bending at the elbows, then extend back up.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Pull exercises
-- ============================================================================
INSERT INTO public.exercise_definitions
  (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed)
VALUES
  ('pull-ups', 'Pull-Ups', 'Hang from a bar with an overhand grip slightly wider than shoulder width. Pull your body up until your chin clears the bar, then lower yourself back down with control.', NULL, NULL, NULL, NULL, NULL, '5-12 reps', false, false),
  ('chin-ups', 'Chin-Ups', 'Hang from a bar with an underhand (supinated) grip at shoulder width. Pull your body up until your chin clears the bar, then lower yourself back down with control.', NULL, NULL, NULL, NULL, NULL, '5-12 reps', false, false),
  ('bb-row', 'Barbell Row', 'Hinge at your hips with a flat back, gripping a barbell with an overhand grip. Pull the bar to your lower chest or upper abdomen, squeezing your shoulder blades together, then lower it.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('db-row', 'Dumbbell Row', 'Place one hand and knee on a bench for support. Hold a dumbbell in the other hand and pull it up to your hip, driving your elbow back and squeezing your lat. Lower with control.', NULL, NULL, NULL, NULL, NULL, '8-12 reps per side', false, false),
  ('lat-pulldown', 'Lat Pulldown', 'Sit at a lat pulldown machine and grip the bar wider than shoulder width. Pull the bar down to your upper chest, squeezing your lats, then slowly return to the start.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('cable-row', 'Cable Row', 'Sit at a cable row station with feet on the footplate and knees slightly bent. Pull the handle to your abdomen, squeezing your shoulder blades together, then extend your arms back.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('face-pull', 'Face Pull', 'Set a cable or band at upper chest height. Pull the handles toward your face, flaring your elbows high and squeezing your rear delts and upper back. Return slowly.', NULL, NULL, NULL, NULL, NULL, '12-15 reps', false, false),
  ('db-shrug', 'Dumbbell Shrug', 'Stand holding heavy dumbbells at your sides. Shrug your shoulders straight up toward your ears, squeezing your traps at the top, then lower back down.', NULL, NULL, NULL, NULL, NULL, '12-15 reps', false, false),
  ('db-bicep-curl', 'Dumbbell Bicep Curl', 'Stand holding dumbbells at your sides with palms facing forward. Curl the weights up toward your shoulders by bending at the elbows, then lower them back down with control.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false),
  ('hammer-curl', 'Hammer Curl', 'Stand holding dumbbells at your sides with palms facing each other (neutral grip). Curl the weights up toward your shoulders, keeping the neutral grip throughout, then lower.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Legs exercises
-- ============================================================================
INSERT INTO public.exercise_definitions
  (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed)
VALUES
  ('bb-squat', 'Barbell Squat', 'Position a barbell on your upper traps. Stand with feet shoulder width apart. Squat down by pushing your hips back and bending your knees until your thighs are parallel, then stand back up.', NULL, NULL, NULL, NULL, NULL, '6-10 reps', false, false),
  ('db-lunges', 'Dumbbell Lunges', 'Hold a dumbbell in each hand at your sides. Step forward with one leg and lower your back knee toward the ground until both knees are at 90 degrees. Push back to standing and alternate legs.', NULL, NULL, NULL, NULL, NULL, '10-12 reps per side', false, false),
  ('rdl', 'Romanian Deadlift', 'Hold a barbell or dumbbells in front of your thighs. Hinge at the hips and push your butt back, lowering the weight along your legs while keeping your back flat. Return to standing by driving your hips forward.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('hip-thrust', 'Hip Thrust', 'Sit on the floor with your upper back against a bench and a barbell across your hips. Drive through your heels to lift your hips until your body forms a straight line from shoulders to knees. Squeeze glutes at the top.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('leg-press', 'Leg Press', 'Sit in the leg press machine with feet shoulder width apart on the platform. Lower the platform by bending your knees toward your chest, then press it back up without locking your knees.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('bulgarian-split-squat', 'Bulgarian Split Squat', 'Stand a couple of feet in front of a bench with one foot elevated behind you on the bench. Lower your back knee toward the ground by bending your front leg, then push back up through the front heel.', NULL, NULL, NULL, NULL, NULL, '8-12 reps per side', false, false),
  ('leg-curl', 'Leg Curl', 'Lie face down on a leg curl machine with the pad just above your ankles. Curl your heels toward your glutes by bending at the knees, then lower with control.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false),
  ('leg-extension', 'Leg Extension', 'Sit in a leg extension machine with the pad on your shins just above your ankles. Extend your knees to raise the weight until your legs are straight, then lower with control.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false),
  ('db-calf-raise', 'Dumbbell Calf Raise', 'Stand on the edge of a step or plate holding dumbbells at your sides. Rise up onto your toes as high as possible, squeeze your calves at the top, then lower your heels below the step.', NULL, NULL, NULL, NULL, NULL, '15-20 reps', false, false),
  ('goblet-squat', 'Goblet Squat', 'Hold a dumbbell or kettlebell vertically against your chest with both hands. Squat down keeping your elbows inside your knees and chest up, then stand back up.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Core exercises
-- ============================================================================
INSERT INTO public.exercise_definitions
  (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed)
VALUES
  ('hanging-leg-raise', 'Hanging Leg Raise', 'Hang from a pull-up bar with arms fully extended. Raise your legs in front of you by flexing at the hips until they are parallel to the floor or higher, then lower them with control.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false),
  ('ab-wheel', 'Ab Wheel Rollout', 'Kneel on the floor holding an ab wheel in front of you. Roll the wheel forward, extending your body as far as you can while keeping your core tight and back flat. Pull back to the start.', NULL, NULL, NULL, NULL, NULL, '8-12 reps', false, false),
  ('russian-twist', 'Russian Twist', 'Sit on the floor with knees bent and feet slightly elevated. Lean back slightly and rotate your torso side to side, touching the floor beside your hip on each side. Hold a weight for added resistance.', NULL, NULL, NULL, NULL, NULL, '15-20 reps per side', false, false),
  ('dead-bug', 'Dead Bug', 'Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees. Slowly extend one arm overhead and the opposite leg outward while keeping your lower back pressed into the floor. Return and alternate.', NULL, NULL, NULL, NULL, NULL, '10-12 reps per side', false, false),
  ('pallof-press', 'Pallof Press', 'Stand perpendicular to a cable machine with the handle at chest height. Hold it at your chest, then press it straight out in front of you, resisting the rotational pull. Hold briefly, then return to your chest.', NULL, NULL, NULL, NULL, NULL, '10-12 reps per side', false, false),
  ('cable-crunch', 'Cable Crunch', 'Kneel in front of a high cable with a rope attachment. Hold the rope behind your head and crunch downward, bringing your elbows toward your knees by flexing your spine. Return with control.', NULL, NULL, NULL, NULL, NULL, '12-15 reps', false, false),
  ('side-plank', 'Side Plank', 'Lie on your side propped up on your forearm with your elbow directly under your shoulder. Lift your hips off the ground so your body forms a straight line. Hold the position, keeping your core engaged.', NULL, NULL, NULL, NULL, NULL, '30-45 seconds per side', false, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Mobility exercises
-- ============================================================================
INSERT INTO public.exercise_definitions
  (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed)
VALUES
  ('foam-roll', 'Foam Roll', 'Use a foam roller to apply pressure along major muscle groups (quads, hamstrings, IT band, upper back, lats, calves). Roll slowly back and forth, pausing on tight spots for 20-30 seconds each.', NULL, NULL, NULL, NULL, NULL, '5-10 minutes', false, true),
  ('hip-circles', 'Hip Circles', 'Stand on one leg and make large controlled circles with the other leg, moving from the hip joint. Perform circles in both directions, then switch legs.', NULL, NULL, NULL, NULL, NULL, '10 circles each direction per side', false, false),
  ('shoulder-dislocates', 'Shoulder Dislocates', 'Hold a band or dowel with a wide overhand grip in front of your body. Keeping your arms straight, slowly raise it overhead and behind your back in a full arc, then reverse the motion.', NULL, NULL, NULL, NULL, NULL, '10-15 reps', false, false),
  ('world-greatest-stretch', 'World''s Greatest Stretch', 'Step into a deep lunge. Place the hand on the same side as your front foot on the ground inside the front foot. Rotate your torso and reach the other arm toward the ceiling. Hold, then switch sides.', NULL, NULL, NULL, NULL, NULL, '5 reps per side', false, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Cardio exercises
-- ============================================================================
INSERT INTO public.exercise_definitions
  (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed)
VALUES
  ('jump-rope', 'Jump Rope', 'Hold the rope handles at hip height with elbows close to your body. Swing the rope over your head and jump just high enough to clear it, landing softly on the balls of your feet.', NULL, NULL, NULL, NULL, NULL, '5-15 minutes', false, true),
  ('rowing', 'Rowing', 'Sit on the rower with feet strapped in. Drive with your legs first, then lean back slightly and pull the handle to your lower chest. Reverse the motion: extend arms, hinge forward, then bend knees.', NULL, NULL, NULL, NULL, NULL, '10-20 minutes', false, true)
ON CONFLICT (id) DO NOTHING;
