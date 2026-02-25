-- Migration: Custom Workout Programs
-- Adds support for user-created custom workout programs beyond the default A/B system.

-- ============================================================================
-- 1. Create user_programs table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Program',
  schedule jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_programs_user
  ON public.user_programs(user_id);

ALTER TABLE public.user_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own programs"
  ON public.user_programs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own programs"
  ON public.user_programs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own programs"
  ON public.user_programs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own programs"
  ON public.user_programs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. Add columns to exercise_logs for set/weight/rep tracking
-- ============================================================================
ALTER TABLE public.exercise_logs ADD COLUMN IF NOT EXISTS set_number integer;
ALTER TABLE public.exercise_logs ADD COLUMN IF NOT EXISTS weight_lbs numeric;
ALTER TABLE public.exercise_logs ADD COLUMN IF NOT EXISTS reps integer;

-- ============================================================================
-- 3. Add columns to workout_sessions for custom workouts
-- ============================================================================
ALTER TABLE public.workout_sessions ADD COLUMN IF NOT EXISTS workout_name text;
ALTER TABLE public.workout_sessions ADD COLUMN IF NOT EXISTS program_id uuid REFERENCES public.user_programs(id) ON DELETE SET NULL;

-- ============================================================================
-- 4. Relax workout_sessions.workout_type CHECK to allow 'custom'
-- ============================================================================
-- Drop the existing CHECK constraint. The constraint name is auto-generated
-- by Postgres as "<table>_<column>_check".
ALTER TABLE public.workout_sessions DROP CONSTRAINT IF EXISTS workout_sessions_workout_type_check;

-- Add new CHECK that allows 'A', 'B', or 'custom'
ALTER TABLE public.workout_sessions
  ADD CONSTRAINT workout_sessions_workout_type_check
  CHECK (workout_type IN ('A', 'B', 'custom'));

-- ============================================================================
-- 5. Relax exercise_definitions constraints for catalog exercises
-- ============================================================================

-- 5a. Drop the existing CHECK on workout_type
ALTER TABLE public.exercise_definitions DROP CONSTRAINT IF EXISTS exercise_definitions_workout_type_check;

-- 5b. Drop NOT NULL constraints on columns that should be nullable for catalog exercises
ALTER TABLE public.exercise_definitions ALTER COLUMN workout_type DROP NOT NULL;
ALTER TABLE public.exercise_definitions ALTER COLUMN phase DROP NOT NULL;
ALTER TABLE public.exercise_definitions ALTER COLUMN phase_name DROP NOT NULL;
ALTER TABLE public.exercise_definitions ALTER COLUMN phase_time_range DROP NOT NULL;
ALTER TABLE public.exercise_definitions ALTER COLUMN order_index DROP NOT NULL;

-- 5c. Add new CHECK on workout_type that allows 'A', 'B', or NULL
ALTER TABLE public.exercise_definitions
  ADD CONSTRAINT exercise_definitions_workout_type_check
  CHECK (workout_type IN ('A', 'B') OR workout_type IS NULL);
