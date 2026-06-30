-- ============================================================
-- MIGRATION 002: Admin Delete Privileges for student_profiles
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Drop the policy if it exists to allow re-runs
DROP POLICY IF EXISTS "Admin can delete profiles" ON public.student_profiles;

-- Create policy allowing the admin to delete any profile
CREATE POLICY "Admin can delete profiles" ON public.student_profiles
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- DONE.
-- ============================================================
