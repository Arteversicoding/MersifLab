-- ============================================
-- SUPABASE SETUP SQL untuk Mersiflab Materials
-- ============================================
-- Jalankan script ini di Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run

-- 1. CREATE STORAGE BUCKET untuk materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials', 
  true,  -- public bucket
  52428800,  -- 50MB limit per file
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'application/zip',
    'application/x-rar-compressed'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. STORAGE POLICIES untuk bucket materials

-- Policy 1: Public Read Access (semua orang bisa download)
CREATE POLICY "Public read access for materials" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'materials');

-- Policy 2: Authenticated Upload (user login bisa upload)
CREATE POLICY "Authenticated users can upload materials" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'materials' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Owner can update their files
CREATE POLICY "Users can update their own materials" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
) 
WITH CHECK (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Owner can delete their files
CREATE POLICY "Users can delete their own materials" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'materials' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 5: Admin can delete any file (optional)
CREATE POLICY "Admin can delete any materials" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'materials' 
  AND auth.jwt() ->> 'role' = 'admin'
);

-- ============================================
-- OPTIONAL: CREATE MATERIALS TABLE (jika ingin pakai Supabase DB juga)
-- ============================================
-- Uncomment jika ingin menyimpan metadata di Supabase juga
-- (saat ini kita pakai Firebase Firestore untuk metadata)

/*
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_path TEXT,
  link_url TEXT,
  file_size BIGINT,
  mime_type VARCHAR(100),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS untuk materials table
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Policy untuk materials table
CREATE POLICY "Public can read materials" 
ON public.materials 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert materials" 
ON public.materials 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own materials" 
ON public.materials 
FOR UPDATE 
USING (auth.uid() = owner_id) 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own materials" 
ON public.materials 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_materials_updated_at 
  BEFORE UPDATE ON public.materials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Jalankan query ini untuk verify setup berhasil

-- Check bucket created
SELECT * FROM storage.buckets WHERE id = 'materials';

-- Check policies created
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%materials%';

-- ============================================
-- CLEANUP (jika perlu reset)
-- ============================================
-- Uncomment dan jalankan jika perlu menghapus semua setup

/*
-- Drop all policies
DROP POLICY IF EXISTS "Public read access for materials" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete any materials" ON storage.objects;

-- Delete bucket (WARNING: This will delete all files!)
DELETE FROM storage.buckets WHERE id = 'materials';

-- Drop table if created
DROP TABLE IF EXISTS public.materials;
DROP FUNCTION IF EXISTS update_updated_at_column();
*/
