CREATE POLICY "neuland uploads insert" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'neuland-einreichungen');