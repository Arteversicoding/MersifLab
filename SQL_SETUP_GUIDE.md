# 🗄️ Panduan Setup Supabase dengan SQL Script

## 🎯 Langkah-Langkah Setup

### 1. Buka Supabase Dashboard
1. Pergi ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Login dengan akun Anda
3. Pilih project Mersiflab: `https://tuurywgzzpuumfpmxinq.supabase.co`

### 2. Buka SQL Editor
1. Di sidebar kiri, klik **SQL Editor**
2. Klik **New Query** (tombol + di atas)
3. Akan muncul editor SQL kosong

### 3. Copy & Paste SQL Script
1. Buka file `supabase-setup.sql`
2. **Copy semua isi file** (Ctrl+A → Ctrl+C)
3. **Paste di SQL Editor** Supabase (Ctrl+V)

### 4. Jalankan Script
1. Klik tombol **Run** (atau tekan Ctrl+Enter)
2. Tunggu sampai selesai (biasanya 2-3 detik)
3. Akan muncul pesan sukses di bagian bawah

### 5. Verifikasi Setup
Jalankan query verifikasi ini di SQL Editor baru:

```sql
-- Check bucket berhasil dibuat
SELECT * FROM storage.buckets WHERE id = 'materials';

-- Check policies berhasil dibuat  
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%materials%';
```

**Expected Results:**
- Bucket `materials` muncul dengan `public = true`
- 5 policies muncul: read, upload, update, delete (owner), delete (admin)

## 📋 Apa yang Dibuat oleh Script

### 🗂️ Storage Bucket "materials"
- **Public bucket**: ✅ (file bisa diakses publik)
- **File size limit**: 50MB per file
- **Allowed types**: PDF, DOC, PPT, XLS, images, videos, archives

### 🔐 Storage Policies
1. **Public Read**: Semua orang bisa download file
2. **Authenticated Upload**: User login bisa upload
3. **Owner Update**: User bisa update file mereka sendiri
4. **Owner Delete**: User bisa hapus file mereka sendiri  
5. **Admin Delete**: Admin bisa hapus file siapa saja

### 📁 File Structure
```
materials/
├── {user_id_1}/
│   ├── buku-ipas-pengenalan_1759677588.pdf
│   └── materi-ai-dasar_1759677612.docx
├── {user_id_2}/
│   └── video-tutorial_1759677635.mp4
└── ...
```

## 🧪 Testing Setup

### Test 1: Upload File
1. Login ke admin dashboard Mersiflab
2. Upload file PDF (contoh: "Buku IPAS.pdf")
3. Check di Supabase Storage → materials bucket
4. File harus muncul dengan struktur folder user

### Test 2: Download File
1. Buka halaman materi (`materi.html`)
2. File yang diupload harus muncul
3. Klik tombol "Download File"
4. File harus terdownload dengan benar

### Test 3: Public Access
1. Copy URL file dari Supabase Storage
2. Buka di browser incognito/private
3. File harus bisa diakses tanpa login

## 🚨 Troubleshooting

### Error: "relation storage.buckets does not exist"
**Solusi**: Project belum enable Storage
1. Dashboard → Storage → Enable Storage
2. Jalankan ulang script

### Error: "permission denied for table storage.objects"
**Solusi**: User tidak punya permission
1. Pastikan login sebagai owner project
2. Atau jalankan sebagai service_role (berbahaya!)

### Bucket tidak muncul di Storage UI
**Solusi**: Refresh browser
1. Tutup tab Supabase
2. Buka ulang dan check Storage

### File upload gagal dari admin dashboard
**Solusi**: Check policies dan bucket
1. Jalankan verification queries
2. Pastikan bucket public = true
3. Check browser console untuk error

## 🔄 Reset Setup (Jika Perlu)

Jika ada masalah dan perlu reset:

```sql
-- HATI-HATI: Ini akan hapus semua file dan setup!
DROP POLICY IF EXISTS "Public read access for materials" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own materials" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete any materials" ON storage.objects;
DELETE FROM storage.buckets WHERE id = 'materials';
```

Setelah reset, jalankan ulang script setup utama.

## ✅ Checklist Setup Berhasil

- [ ] SQL script berhasil dijalankan tanpa error
- [ ] Bucket "materials" muncul di Storage UI
- [ ] 5 policies terbuat untuk storage.objects
- [ ] Upload file dari admin dashboard berhasil
- [ ] File muncul di halaman materi
- [ ] Download file berfungsi dengan baik
- [ ] File bisa diakses publik (tanpa auth)
