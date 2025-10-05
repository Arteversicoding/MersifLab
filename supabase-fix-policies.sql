    -- ============================================
    -- FIX SUPABASE STORAGE POLICIES - Mersiflab
    -- ============================================
    -- Jalankan script ini untuk memperbaiki error RLS policy

    -- 1. DROP existing policies yang bermasalah
    DROP POLICY IF EXISTS "Authenticated users can upload materials" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own materials" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own materials" ON storage.objects;
    DROP POLICY IF EXISTS "Admin can delete any materials" ON storage.objects;

    -- 2. CREATE new policies yang lebih permisif

    -- Policy untuk PUBLIC UPLOAD (sementara untuk testing)
    CREATE POLICY "Allow public upload to materials bucket" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'materials');

    -- Policy untuk PUBLIC UPDATE (sementara untuk testing)
    CREATE POLICY "Allow public update in materials bucket" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'materials')
    WITH CHECK (bucket_id = 'materials');

    -- Policy untuk PUBLIC DELETE (sementara untuk testing)
    CREATE POLICY "Allow public delete in materials bucket" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'materials');

    -- 3. Verify policies created
    SELECT schemaname, tablename, policyname, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname LIKE '%materials%';

    -- ============================================
    -- ALTERNATIVE: More secure policies (uncomment jika mau lebih aman)
    -- ============================================
    /*
    -- Hapus public policies di atas dan ganti dengan ini:

    DROP POLICY IF EXISTS "Allow public upload to materials bucket" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public update in materials bucket" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public delete in materials bucket" ON storage.objects;

    -- Policy dengan API key authentication
    CREATE POLICY "API authenticated upload to materials" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (
    bucket_id = 'materials' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

    CREATE POLICY "API authenticated update in materials" 
    ON storage.objects 
    FOR UPDATE 
    USING (
    bucket_id = 'materials' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
    )
    WITH CHECK (
    bucket_id = 'materials' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

    CREATE POLICY "API authenticated delete in materials" 
    ON storage.objects 
    FOR DELETE 
    USING (
    bucket_id = 'materials' 
    AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );
    */
