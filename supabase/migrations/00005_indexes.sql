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
