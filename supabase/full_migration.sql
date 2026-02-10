-- UniLife 360 - Initial Schema
-- 14 tables for the complete student life OS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ENUM TYPES
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE transaction_category AS ENUM (
  'salary', 'scholarship', 'financial_aid', 'freelance', 'gift', 'other_income',
  'rent', 'utilities', 'groceries', 'eating_out', 'transport',
  'entertainment', 'clothing', 'health', 'education', 'subscriptions',
  'phone', 'insurance', 'savings', 'other_expense'
);
CREATE TYPE recurrence_type AS ENUM ('none', 'weekly', 'biweekly', 'monthly', 'yearly');
CREATE TYPE circle_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE ticket_status AS ENUM ('reserved', 'paid', 'cancelled', 'used');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE exam_question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay');
CREATE TYPE ai_conversation_context AS ENUM ('finance', 'tutor', 'scheduler', 'summarizer', 'exam_generator');
CREATE TYPE note_visibility AS ENUM ('private', 'course_shared', 'public');

-- HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- USERS (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  university TEXT,
  study_field TEXT,
  study_year INTEGER CHECK (study_year BETWEEN 1 AND 8),
  date_of_birth DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- FINANCIAL PROFILES
CREATE TABLE public.financial_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  country_code CHAR(2) NOT NULL DEFAULT 'FR',
  city TEXT,
  currency_code CHAR(3) NOT NULL DEFAULT 'EUR',
  monthly_budget DECIMAL(10,2),
  inflation_rate DECIMAL(5,2),
  avg_grocery_basket DECIMAL(10,2),
  avg_energy_cost DECIMAL(10,2),
  avg_transport_cost DECIMAL(10,2),
  economic_data_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_financial_profiles_updated_at
  BEFORE UPDATE ON public.financial_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- INCOME SOURCES
CREATE TABLE public.income_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category transaction_category NOT NULL DEFAULT 'other_income',
  recurrence recurrence_type NOT NULL DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_income_sources_updated_at
  BEFORE UPDATE ON public.income_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- EXPENSES
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category transaction_category NOT NULL,
  description TEXT,
  transaction_type transaction_type NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  recurrence recurrence_type NOT NULL DEFAULT 'none',
  is_fixed_charge BOOLEAN DEFAULT FALSE,
  merchant_name TEXT,
  receipt_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- CALENDAR EVENTS
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  external_uid TEXT,
  external_calendar_url TEXT,
  activity_type TEXT,
  is_ai_suggested BOOLEAN DEFAULT FALSE,
  ai_suggestion_accepted BOOLEAN,
  recurrence_rule TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- COURSES
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  professor TEXT,
  university TEXT,
  semester TEXT,
  color TEXT DEFAULT '#d8b4fe',
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- NOTES
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  plain_text TEXT,
  visibility note_visibility NOT NULL DEFAULT 'private',
  tags TEXT[] DEFAULT '{}',
  word_count INTEGER DEFAULT 0,
  ai_summary TEXT,
  ai_summary_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- EXAMS
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  source_note_ids UUID[] DEFAULT '{}',
  total_points DECIMAL(5,1),
  time_limit_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- EXAM QUESTIONS
CREATE TABLE public.exam_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_type exam_question_type NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  points DECIMAL(4,1) DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CIRCLES
CREATE TABLE public.circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  university TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  max_members INTEGER DEFAULT 500,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_circles_updated_at
  BEFORE UPDATE ON public.circles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- CIRCLE MEMBERS
CREATE TABLE public.circle_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role circle_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(circle_id, user_id)
);

-- EVENTS
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  location TEXT,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status event_status NOT NULL DEFAULT 'draft',
  max_attendees INTEGER,
  ticket_price DECIMAL(10,2) DEFAULT 0,
  currency_code CHAR(3) DEFAULT 'EUR',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- EVENT TICKETS
CREATE TABLE public.event_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status ticket_status NOT NULL DEFAULT 'reserved',
  ticket_code TEXT NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  price_paid DECIMAL(10,2) DEFAULT 0,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- AI CONVERSATIONS
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  context ai_conversation_context NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
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
-- UniLife 360 - Storage Buckets

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('academic-files', 'academic-files', false, 52428800,
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('event-covers', 'event-covers', true, 10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('receipts', 'receipts', false, 10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

-- Storage RLS
CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid())::text);
CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid())::text);

CREATE POLICY "academic_files_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'academic-files' AND (
    (storage.foldername(name))[1] = (select auth.uid())::text
    OR (storage.foldername(name))[1] = 'shared'
  ));
CREATE POLICY "academic_files_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'academic-files' AND (storage.foldername(name))[1] = (select auth.uid())::text);

CREATE POLICY "receipts_all" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = (select auth.uid())::text)
  WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = (select auth.uid())::text);

CREATE POLICY "event_covers_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-covers');
CREATE POLICY "event_covers_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-covers');
-- UniLife 360 - Realtime Configuration

ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
-- UniLife 360 - Performance Indexes

CREATE INDEX idx_financial_profiles_user_id ON public.financial_profiles(user_id);
CREATE INDEX idx_income_sources_user_id ON public.income_sources(user_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date DESC);
CREATE INDEX idx_expenses_category ON public.expenses(category);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, date DESC);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX idx_calendar_events_start ON public.calendar_events(start_time);
CREATE INDEX idx_calendar_events_user_time ON public.calendar_events(user_id, start_time);
CREATE INDEX idx_courses_user_id ON public.courses(user_id);
CREATE INDEX idx_courses_university ON public.courses(university);
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_course_id ON public.notes(course_id);
CREATE INDEX idx_notes_visibility ON public.notes(visibility);
CREATE INDEX idx_exams_course_id ON public.exams(course_id);
CREATE INDEX idx_exams_user_id ON public.exams(user_id);
CREATE INDEX idx_exam_questions_exam_id ON public.exam_questions(exam_id);
CREATE INDEX idx_circles_university ON public.circles(university);
CREATE INDEX idx_circle_members_circle_id ON public.circle_members(circle_id);
CREATE INDEX idx_circle_members_user_id ON public.circle_members(user_id);
CREATE INDEX idx_circle_members_composite ON public.circle_members(circle_id, user_id);
CREATE INDEX idx_events_circle_id ON public.events(circle_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_event_tickets_event_id ON public.event_tickets(event_id);
CREATE INDEX idx_event_tickets_user_id ON public.event_tickets(user_id);
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_context ON public.ai_conversations(context);

CREATE INDEX idx_notes_plain_text_search ON public.notes
  USING gin(to_tsvector('english', COALESCE(plain_text, '')));
CREATE INDEX idx_courses_name_trgm ON public.courses
  USING gin(name gin_trgm_ops);
