-- UniLife 360 - Row Level Security Policies

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- USERS
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY "users_select_public" ON public.users
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

-- FINANCIAL (strictly private)
CREATE POLICY "fp_all_own" ON public.financial_profiles
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "income_all_own" ON public.income_sources
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "expenses_all_own" ON public.expenses
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- CALENDAR (private)
CREATE POLICY "calendar_all_own" ON public.calendar_events
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- COURSES (own + shared by university)
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR (is_shared = true AND university IN (
      SELECT university FROM public.users WHERE id = (select auth.uid())
    ))
  );
CREATE POLICY "courses_insert_own" ON public.courses
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "courses_update_own" ON public.courses
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "courses_delete_own" ON public.courses
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- NOTES (private + course_shared + public)
CREATE POLICY "notes_select" ON public.notes
  FOR SELECT TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR visibility = 'public'
    OR (visibility = 'course_shared' AND course_id IN (
      SELECT id FROM public.courses WHERE is_shared = true
      AND university IN (SELECT university FROM public.users WHERE id = (select auth.uid()))
    ))
  );
CREATE POLICY "notes_insert_own" ON public.notes
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "notes_update_own" ON public.notes
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "notes_delete_own" ON public.notes
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- EXAMS
CREATE POLICY "exams_select" ON public.exams
  FOR SELECT TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR course_id IN (SELECT id FROM public.courses WHERE is_shared = true
      AND university IN (SELECT university FROM public.users WHERE id = (select auth.uid())))
  );
CREATE POLICY "exams_insert_own" ON public.exams
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "exams_update_own" ON public.exams
  FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "exams_delete_own" ON public.exams
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- EXAM QUESTIONS
CREATE POLICY "exam_questions_select" ON public.exam_questions
  FOR SELECT TO authenticated
  USING (exam_id IN (SELECT id FROM public.exams WHERE (select auth.uid()) = user_id
    OR course_id IN (SELECT id FROM public.courses WHERE is_shared = true
      AND university IN (SELECT university FROM public.users WHERE id = (select auth.uid())))));
CREATE POLICY "exam_questions_insert" ON public.exam_questions
  FOR INSERT TO authenticated
  WITH CHECK (exam_id IN (SELECT id FROM public.exams WHERE user_id = (select auth.uid())));

-- CIRCLES
CREATE POLICY "circles_select" ON public.circles
  FOR SELECT TO authenticated
  USING (is_public = true OR id IN (
    SELECT circle_id FROM public.circle_members WHERE user_id = (select auth.uid())
  ));
CREATE POLICY "circles_insert" ON public.circles
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY "circles_update" ON public.circles
  FOR UPDATE TO authenticated
  USING (id IN (SELECT circle_id FROM public.circle_members
    WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')));
CREATE POLICY "circles_delete" ON public.circles
  FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

-- CIRCLE MEMBERS
CREATE POLICY "circle_members_select" ON public.circle_members
  FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM public.circle_members WHERE user_id = (select auth.uid()))
    OR circle_id IN (SELECT id FROM public.circles WHERE is_public = true));
CREATE POLICY "circle_members_insert" ON public.circle_members
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id OR circle_id IN (
    SELECT circle_id FROM public.circle_members
    WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')));
CREATE POLICY "circle_members_delete" ON public.circle_members
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id OR circle_id IN (
    SELECT circle_id FROM public.circle_members
    WHERE user_id = (select auth.uid()) AND role IN ('owner', 'admin')));

-- EVENTS
CREATE POLICY "events_select" ON public.events
  FOR SELECT TO authenticated
  USING (status = 'published' OR (select auth.uid()) = created_by);
CREATE POLICY "events_insert" ON public.events
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY "events_update" ON public.events
  FOR UPDATE TO authenticated USING ((select auth.uid()) = created_by);
CREATE POLICY "events_delete" ON public.events
  FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

-- TICKETS
CREATE POLICY "tickets_select_own" ON public.event_tickets
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "tickets_select_organizer" ON public.event_tickets
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT id FROM public.events WHERE created_by = (select auth.uid())));
CREATE POLICY "tickets_insert" ON public.event_tickets
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "tickets_update_own" ON public.event_tickets
  FOR UPDATE TO authenticated USING ((select auth.uid()) = user_id);

-- AI CONVERSATIONS (strictly private)
CREATE POLICY "ai_conversations_all_own" ON public.ai_conversations
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
