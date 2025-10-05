# 🔧 Fix RLS Policy Error - Supabase Storage

## 🚨 Error yang Terjadi

### Error 1: RLS Policy
```
StorageApiError: new row violates row-level security policy
POST https://tuurywgzzpuumfpmxinq.supabase.co/storage/v1/object/materials/... 400 (Bad Request)
```

### Error 2: Bucket Not Found (CURRENT)
```
StorageApiError: Bucket not found
Upload gagal: Bucket not found
```

## 🔍 Root Cause
Error "Bucket not found" terjadi karena:
1. **Bucket 'materials' belum dibuat** di Supabase Storage
2. **Setup awal belum dijalankan** dengan benar
3. **Storage belum di-enable** di project Supabase

Error RLS Policy (sebelumnya) terjadi karena:
1. **RLS Policy terlalu ketat** - memerlukan user authenticated
2. **Admin dashboard tidak ter-autentikasi** di Supabase (hanya di Firebase)
3. **Policy mismatch** - policy expect `auth.role() = 'authenticated'` tapi user anonymous

## ✅ Solusi Lengkap (UPDATED)

### Step 1: Jalankan Complete Setup
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy semua isi file `supabase-complete-setup.sql` (bukan yang fix-policies)
3. **Paste & Run** di SQL Editor
4. Tunggu sampai selesai (akan create bucket + policies sekaligus)

### Step 2: Verify Fix
Jalankan query ini untuk check policies:
```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%materials%';
```

**Expected result**: 
- 1 bucket dengan id='materials', public=true
- 4 policies: "Public read access", "Allow public upload", "Allow public update", "Allow public delete"

### Step 3: Test Upload
1. Refresh admin dashboard
2. Coba upload file lagi
3. Seharusnya berhasil tanpa error

## 🔧 Apa yang Diperbaiki

### Before (Bermasalah):
```sql
-- Policy ini memerlukan user authenticated
CREATE POLICY "Authenticated users can upload materials" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'materials' 
  AND auth.role() = 'authenticated'  -- ❌ Ini yang bikin error
);
```

### After (Fixed):
```sql
-- Policy ini allow public upload
CREATE POLICY "Allow public upload to materials bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'materials');  -- ✅ Hanya check bucket
```

## 🛡️ Security Considerations

### Current Setup (Public):
- ✅ **Pro**: Upload langsung bisa, tidak perlu auth
- ⚠️ **Con**: Siapa saja bisa upload ke bucket (tapi hanya admin yang punya akses dashboard)

### Alternative (Lebih Aman):
Jika ingin lebih aman, uncomment bagian "ALTERNATIVE" di `supabase-fix-policies.sql`:
```sql
-- Policy dengan API key authentication
CREATE POLICY "API authenticated upload to materials" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'materials' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
);
```

## 🧪 Testing Checklist

### ✅ Test 1: Upload File
- [ ] Buka admin dashboard
- [ ] Upload file PDF (contoh: "Test Upload.pdf")
- [ ] Tidak ada error di console
- [ ] File berhasil tersimpan

### ✅ Test 2: Check Storage
- [ ] Buka Supabase Dashboard → Storage → materials
- [ ] File muncul dengan nama yang benar
- [ ] File bisa di-preview/download

### ✅ Test 3: Check Website
- [ ] Buka halaman materi (`materi.html`)
- [ ] File yang diupload muncul di list
- [ ] Download button berfungsi

## 🚨 Troubleshooting Lanjutan

### Jika masih error setelah fix:

#### 1. Clear Browser Cache
```bash
# Chrome/Edge
Ctrl + Shift + Delete → Clear all

# Firefox  
Ctrl + Shift + Delete → Clear all
```

#### 2. Check Bucket Exists
```sql
SELECT * FROM storage.buckets WHERE id = 'materials';
```
Harus return 1 row dengan `public = true`

#### 3. Check Policies Applied
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%materials%';
```
Harus return 4 policies: SELECT, INSERT, UPDATE, DELETE

#### 4. Manual Policy Reset
Jika masih bermasalah, reset semua:
```sql
-- Drop all materials policies
DROP POLICY IF EXISTS "Public read access for materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to materials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update in materials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete in materials bucket" ON storage.objects;

-- Recreate minimal policy
CREATE POLICY "materials_all_access" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');
```

#### 5. Check File Size & Type
- **Max file size**: 50MB
- **Allowed types**: PDF, DOC, images, videos
- File terlalu besar atau type tidak support bisa cause error

## 📋 Quick Fix Commands

### Reset Everything:
```sql
-- 1. Drop bucket (WARNING: deletes all files!)
DELETE FROM storage.buckets WHERE id = 'materials';

-- 2. Recreate bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('materials', 'materials', true);

-- 3. Create simple policy
CREATE POLICY "materials_full_access" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'materials')
WITH CHECK (bucket_id = 'materials');
```

### Verify Fix:
```sql
-- Check bucket
SELECT * FROM storage.buckets WHERE id = 'materials';

-- Check policy  
SELECT policyname FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%materials%';
```

## ✅ Success Indicators

Upload berhasil jika:
- ✅ No error di browser console
- ✅ File muncul di Supabase Storage
- ✅ File muncul di halaman materi
- ✅ Download berfungsi
- ✅ Console log shows "Upload successful"
