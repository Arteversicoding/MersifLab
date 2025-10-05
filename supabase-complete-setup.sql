-- ============================================
-- COMPLETE SUPABASE SETUP - Mersiflab Materials
-- ============================================
-- Script lengkap untuk membuat bucket dan policies dari awal

-- 1. HAPUS bucket lama jika ada (optional, uncomment jika perlu reset)
-- DELETE FROM storage.buckets WHERE id = 'materials';

-- 2. CREATE BUCKET materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials', 
  true,  -- public bucket agar bisa diakses
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

-- 3. DROP existing policies jika ada
DROP POLICY IF EXISTS "Public read access for materials" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete any materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to materials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update in materials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete in materials bucket" ON storage.objects;

-- 4. CREATE PUBLIC POLICIES (untuk fix RLS error)

-- Policy 1: Public Read Access
CREATE POLICY "Public read access for materials" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'materials');

-- Policy 2: Public Upload Access  
CREATE POLICY "Allow public upload to materials bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'materials');

-- Policy 3: Public Update Access
CREATE POLICY "Allow public update in materials bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');

-- Policy 4: Public Delete Access
CREATE POLICY "Allow public delete in materials bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'materials');

-- 5. VERIFY SETUP
-- Check bucket created
SELECT 'BUCKET CHECK:' as check_type, * FROM storage.buckets WHERE id = 'materials';

-- Check policies created
SELECT 'POLICIES CHECK:' as check_type, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%materials%'
ORDER BY policyname;

-- Count total policies for materials
SELECT 'POLICY COUNT:' as check_type, COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%materials%';

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- BUCKET CHECK: Should return 1 row with id='materials', public=true
-- POLICIES CHECK: Should return 4 rows (SELECT, INSERT, UPDATE, DELETE)
-- POLICY COUNT: Should return total_policies = 4
