-- Update X3 band profiles to match actual X3 bar band specifications
-- Remove old bands that don't exist
DELETE FROM public.x3_band_profiles WHERE id IN ('elite', 'elite-plus');

-- Add Extra Light band
INSERT INTO public.x3_band_profiles (id, name, color, color_hex, min_resistance_lbs, max_resistance_lbs)
VALUES ('extra-light', 'Extra Light', 'White', '#e4e4e7', 10, 50)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  color_hex = EXCLUDED.color_hex,
  min_resistance_lbs = EXCLUDED.min_resistance_lbs,
  max_resistance_lbs = EXCLUDED.max_resistance_lbs;

-- Update Light band (correct color from White to Light Grey)
UPDATE public.x3_band_profiles
SET color = 'Light Grey', color_hex = '#a1a1aa'
WHERE id = 'light';

-- Update Medium band (correct color from Green to Dark Grey)
UPDATE public.x3_band_profiles
SET color = 'Dark Grey', color_hex = '#52525b', min_resistance_lbs = 50, max_resistance_lbs = 120
WHERE id = 'medium';

-- Update Heavy band (correct color from Orange to Black)
UPDATE public.x3_band_profiles
SET color = 'Black', color_hex = '#18181b'
WHERE id = 'heavy';

-- Update any exercise logs that reference deleted bands to use the closest equivalent
UPDATE public.exercise_logs SET band_id = 'heavy' WHERE band_id = 'elite';
UPDATE public.exercise_logs SET band_id = 'heavy' WHERE band_id = 'elite-plus';
