-- Seed X3 band profiles
insert into public.x3_band_profiles (id, name, color, color_hex, min_resistance_lbs, max_resistance_lbs) values
  ('light', 'Light', 'White', '#e4e4e7', 25, 80),
  ('medium', 'Medium', 'Green', '#22c55e', 40, 120),
  ('heavy', 'Heavy', 'Orange', '#f97316', 60, 150),
  ('elite', 'Elite', 'Black', '#18181b', 100, 300),
  ('elite-plus', 'Elite+', 'Gray', '#71717a', 150, 500)
on conflict (id) do nothing;

-- Seed exercise definitions: Workout A
insert into public.exercise_definitions (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed) values
  ('a-1-1', 'Cat-Cow', 'Get on all fours. Inhale as you drop your belly and lift your chest (Cow). Exhale as you round your spine toward the ceiling and tuck your chin (Cat).', 'A', 1, 'Posture & Mobility Warm-up', '0–10 Minutes', 1, '15 reps', false, false),
  ('a-1-2', 'Wall Angels', 'Stand with your heels, butt, upper back, and head against a wall. Raise your arms to 90 degrees (like a goalpost) with elbows and wrists touching the wall. Slowly slide your arms up and down without letting any part of your back or arms lose contact with the wall.', 'A', 1, 'Posture & Mobility Warm-up', '0–10 Minutes', 2, '20 reps', false, false),
  ('a-1-3', 'Band Pull-Aparts', 'Using a standard, light resistance band (not an X3 band), hold it straight out in front of your chest. Keep your arms straight and squeeze your shoulder blades together to pull the band apart until it touches your chest. Return slowly.', 'A', 1, 'Posture & Mobility Warm-up', '0–10 Minutes', 3, '20 reps', false, false),
  ('a-2-1', 'Protraction & Retraction / Chin Tucks', 'Facing away from the anchor, push your head forward (protract) against the band''s resistance. Then, pull your head straight back, giving yourself a "double chin" (retract).', 'A', 2, 'Iron Neck – Isometrics & Stability', '10–20 Minutes', 1, '15 reps', false, false),
  ('a-2-2', 'Left & Right Look', 'Stand with the anchor to your side so the tension pulls laterally. Slowly turn your head to look over one shoulder, then the other, keeping your shoulders completely still. Switch sides.', 'A', 2, 'Iron Neck – Isometrics & Stability', '10–20 Minutes', 2, '15 reps per side', false, false),
  ('a-2-3', 'Isometric Holds', 'Step out to create tension. Hold your head perfectly straight and still. Do this facing the anchor, facing away from the anchor, and with the anchor to your left, then your right.', 'A', 2, 'Iron Neck – Isometrics & Stability', '10–20 Minutes', 3, '30 seconds each direction', false, true),
  ('a-3-1', 'Front Squat', 'Step on the footplate. Hook the band under the plate and over the bar. Bring the bar up to your collarbone (resting on the front of your shoulders). Squat down, keeping your chest up, and stand back up to near-lockout.', 'A', 3, 'X3 System – Push Focus', '20–35 Minutes', 1, '1 set to failure', true, false),
  ('a-3-2', 'Chest Press', 'Wrap the band around your back. Push the bar straight out in front of your chest. Do not lock your elbows at the top; keep the tension on your chest.', 'A', 3, 'X3 System – Push Focus', '20–35 Minutes', 2, '1 set to failure', true, false),
  ('a-3-3', 'Overhead Press', 'Step on the band. Bring the bar to your upper chest. Press the bar straight up over your head until your arms are extended, then slowly lower it back to your collarbone.', 'A', 3, 'X3 System – Push Focus', '20–35 Minutes', 3, '1 set to failure', true, false),
  ('a-3-4', 'Triceps Press', 'Step on the band. Lean slightly forward. Hold the bar with an overhand grip at chest level. Keep your elbows pinned to your ribs and press the bar straight down toward your thighs.', 'A', 3, 'X3 System – Push Focus', '20–35 Minutes', 4, '1 set to failure', true, false)
on conflict (id) do nothing;

-- Seed exercise definitions: Workout B
insert into public.exercise_definitions (id, name, description, workout_type, phase, phase_name, phase_time_range, order_index, default_reps, is_x3, is_timed) values
  ('b-1-1', 'Plank', 'Support your weight on your forearms and toes. Keep your body in a perfectly straight line from your head to your heels. Squeeze your glutes and brace your core.', 'B', 1, 'Posture & Core Warm-up', '0–10 Minutes', 1, '60 seconds', false, true),
  ('b-1-2', 'Glute Bridges', 'Lie on your back with knees bent and feet flat on the floor. Drive through your heels to lift your hips toward the ceiling. Squeeze your glutes hard at the top for 2 seconds, then lower down.', 'B', 1, 'Posture & Core Warm-up', '0–10 Minutes', 2, '20 reps', false, false),
  ('b-1-3', 'Bird-Dog', 'Get on all fours. Extend your right arm straight forward and your left leg straight back simultaneously. Keep your back completely flat (imagine balancing a glass of water on it). Return to the start and switch sides.', 'B', 1, 'Posture & Core Warm-up', '0–10 Minutes', 3, '10 reps per side', false, false),
  ('b-2-1', '360 Spins', 'Step away from the anchor to create moderate tension. Slowly walk in a complete, controlled circle while keeping your head and neck perfectly aligned and stable. Repeat in the opposite direction.', 'B', 2, 'Iron Neck – Rotational Strength', '10–20 Minutes', 1, '5 spins each way', false, false),
  ('b-2-2', 'Figure Eights', 'Facing away from the anchor, use your nose as a pointer and slowly trace a large "8" in the air. Keep the movement strictly in your neck, not your torso.', 'B', 2, 'Iron Neck – Rotational Strength', '10–20 Minutes', 2, '10 reps', false, false),
  ('b-2-3', 'Diagonals', 'Stand with the anchor behind you. Look down toward your left hip, then trace a diagonal line up toward the ceiling on your right side. Complete all reps, then switch to down-right/up-left.', 'B', 2, 'Iron Neck – Rotational Strength', '10–20 Minutes', 3, '10 reps per side', false, false),
  ('b-3-1', 'Deadlift', 'Step on the footplate with the band looped under it. Hinge at your hips, grab the bar, keep your back completely flat, and stand up straight. Thrust your hips slightly forward at the top.', 'B', 3, 'X3 System – Pull Focus', '20–35 Minutes', 1, '1 set to failure', true, false),
  ('b-3-2', 'Bent-Over Row', 'Step on the band. Hinge forward at a 45-degree angle. Let the bar hang down, then pull it firmly up to your belly button, squeezing your back muscles. Lower it slowly.', 'B', 3, 'X3 System – Pull Focus', '20–35 Minutes', 2, '1 set to failure', true, false),
  ('b-3-3', 'Bicep Curl', 'Step on the band. Hold the bar with an underhand grip. Keep your elbows locked at your sides and curl the bar up toward your shoulders.', 'B', 3, 'X3 System – Pull Focus', '20–35 Minutes', 3, '1 set to failure', true, false),
  ('b-3-4', 'Calf Raise', 'Step on the footplate with your toes on the edge so your heels can drop. Hold the bar at waist height (like the top of a deadlift) or at your chest. Raise up onto your toes, squeeze your calves, and lower your heels slowly.', 'B', 3, 'X3 System – Pull Focus', '20–35 Minutes', 4, '1 set to failure', true, false)
on conflict (id) do nothing;
