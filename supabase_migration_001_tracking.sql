-- ============================================================
-- MIGRATION 001: student_company_tracking
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Helper function: is the current request from the admin? ──────────────
-- This is used in RLS policies so we don't hardcode email in every policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT auth.email() = 'msrahgul@gmail.com';
$$;

-- ── 2. Create the student_company_tracking table ────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_company_tracking (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id    int4        NOT NULL,
  preparation_stage varchar  NOT NULL DEFAULT 'Not Started'
                            CHECK (preparation_stage IN (
                              'Not Started',
                              'Researching',
                              'Skill Building',
                              'Interview Prep',
                              'Ready'
                            )),
  last_updated  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, company_id)
);

-- ── 3. Enable Row Level Security ────────────────────────────────────────────
ALTER TABLE public.student_company_tracking ENABLE ROW LEVEL SECURITY;

-- ── 4. Drop any stale policies (idempotent re-run safety) ──────────────────
DROP POLICY IF EXISTS "Students can manage their own tracking"   ON public.student_company_tracking;
DROP POLICY IF EXISTS "Admin can read all tracking"              ON public.student_company_tracking;
DROP POLICY IF EXISTS "Authenticated users can view all tracking for leaderboard" ON public.student_company_tracking;

-- ── 5. Policies ─────────────────────────────────────────────────────────────

-- Students can fully manage (SELECT / INSERT / UPDATE / DELETE) their own rows
CREATE POLICY "Students can manage their own tracking"
  ON public.student_company_tracking
  FOR ALL
  USING      (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- ALL authenticated users can SELECT all rows (needed for company leaderboard)
CREATE POLICY "Authenticated users can view all tracking for leaderboard"
  ON public.student_company_tracking
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin gets unrestricted SELECT (belt-and-suspenders, already covered above)
CREATE POLICY "Admin can read all tracking"
  ON public.student_company_tracking
  FOR SELECT
  USING (public.is_admin());

-- ── 6. Auto-update last_updated via trigger ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_tracking_last_updated()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_tracking_last_updated ON public.student_company_tracking;

CREATE TRIGGER trg_tracking_last_updated
  BEFORE UPDATE ON public.student_company_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.set_tracking_last_updated();

-- ── 7. Index for common query patterns ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tracking_company_id  ON public.student_company_tracking (company_id);
CREATE INDEX IF NOT EXISTS idx_tracking_student_id  ON public.student_company_tracking (student_id);
CREATE INDEX IF NOT EXISTS idx_tracking_stage       ON public.student_company_tracking (preparation_stage);

-- ============================================================
-- DONE. Verify with:
--   SELECT * FROM public.student_company_tracking LIMIT 5;
-- ============================================================
