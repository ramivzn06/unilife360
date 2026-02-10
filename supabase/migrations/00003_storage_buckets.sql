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
