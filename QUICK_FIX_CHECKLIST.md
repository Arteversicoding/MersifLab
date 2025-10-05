# ⚡ Quick Fix Checklist - Bucket Not Found Error

## 🎯 Error: "Bucket not found"

### ✅ Step 1: Enable Storage (PENTING!)
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project: `https://tuurywgzzpuumfpmxinq.supabase.co`
3. **Sidebar kiri** → klik **Storage**
4. Jika muncul tombol **"Enable Storage"** → **KLIK**
5. Tunggu sampai Storage aktif (biasanya 10-30 detik)

### ✅ Step 2: Jalankan Complete Setup
1. **Storage** sudah aktif → klik **SQL Editor** (sidebar kiri)
2. Klik **New Query** (tombol + di atas)
3. **Copy semua isi** file `supabase-complete-setup.sql`
4. **Paste** di SQL Editor
5. Klik **Run** (atau Ctrl+Enter)
6. Tunggu sampai selesai

### ✅ Step 3: Verify Setup
Setelah SQL selesai, jalankan query ini:
```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'materials';

-- Check policies exists  
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%materials%';
```

**Expected Results:**
- Bucket query: 1 row dengan `id = 'materials'`, `public = true`
- Policy query: `policy_count = 4`

### ✅ Step 4: Test Upload
1. **Refresh** admin dashboard (F5)
2. **Upload file** PDF (contoh: "Test.pdf")
3. **Check console** - tidak ada error
4. **Check Storage** - file muncul di bucket materials

## 🚨 Troubleshooting

### Jika Storage tidak bisa di-enable:
- **Refresh browser** dan coba lagi
- **Check billing** - pastikan project tidak suspended
- **Contact Supabase support** jika masih bermasalah

### Jika SQL error saat run:
```sql
-- Reset dan coba lagi
DELETE FROM storage.buckets WHERE id = 'materials';

-- Kemudian jalankan ulang supabase-complete-setup.sql
```

### Jika masih "Bucket not found":
1. **Check di Storage UI** - apakah bucket 'materials' muncul?
2. **Refresh browser** admin dashboard
3. **Check console network tab** - apakah request ke URL yang benar?

### Jika upload masih gagal:
1. **Check file size** < 50MB
2. **Check file type** (PDF, DOC, images, etc.)
3. **Clear browser cache** dan coba lagi

## ✅ Success Indicators

Setup berhasil jika:
- ✅ Storage menu muncul di Supabase sidebar
- ✅ Bucket 'materials' muncul di Storage UI
- ✅ SQL query return expected results
- ✅ Upload file berhasil tanpa error
- ✅ File muncul di Storage dan halaman materi

## 🔄 Reset Complete (Jika Perlu)

Jika semua gagal, reset total:
```sql
-- WARNING: Ini akan hapus semua data!
DELETE FROM storage.objects WHERE bucket_id = 'materials';
DELETE FROM storage.buckets WHERE id = 'materials';

-- Kemudian jalankan ulang supabase-complete-setup.sql
```
