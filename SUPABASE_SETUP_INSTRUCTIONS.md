# 🗂️ Setup Supabase Storage untuk Materi Mersiflab

## 🎯 Database Baru Supabase
- **Project URL**: `https://tuurywgzzpuumfpmxinq.supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dXJ5d2d6enB1dW1mcG14aW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2Nzc1ODgsImV4cCI6MjA3NTI1MzU4OH0.ewRTIGcNmlK3oynwBSOGF-Lrd3Z2hljIhNkSGqEm6SU`

## 📁 Setup Storage Bucket

### Langkah 1: Buat Bucket "materials"
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Mersiflab yang baru
3. Di sidebar kiri, klik **Storage**
4. Klik **New bucket**
5. Nama bucket: `materials`
6. **Public bucket**: ✅ **CENTANG** (agar file bisa diakses publik)
7. Klik **Save**

### Langkah 2: Setup Storage Policies
Setelah bucket dibuat, klik bucket "materials" → **Policies** → **New Policy**

#### Policy 1: Public Read Access
```sql
-- Policy Name: Public read access for materials
-- Operation: SELECT
-- Target roles: public

CREATE POLICY "Public read access for materials" ON storage.objects
FOR SELECT USING (bucket_id = 'materials');
```

#### Policy 2: Authenticated Upload
```sql
-- Policy Name: Authenticated users can upload materials  
-- Operation: INSERT
-- Target roles: authenticated

CREATE POLICY "Authenticated users can upload materials" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'materials' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Admin Delete Access
```sql
-- Policy Name: Admin can delete materials
-- Operation: DELETE  
-- Target roles: authenticated

CREATE POLICY "Admin can delete materials" ON storage.objects
FOR DELETE USING (
  bucket_id = 'materials'
  AND auth.role() = 'authenticated'
);
```

## 🔧 Struktur File Upload

### Format Nama File
```
{sanitized-title}-{sanitized-description}_{timestamp}.{extension}
```

### Contoh:
- Input: "Buku IPAS.pdf"
- Output: `buku-ipas-pengenalan-sains_1759677588123.pdf`

### Supported File Types
- **Documents**: PDF, DOC, DOCX, PPT, PPTX
- **Images**: JPG, PNG, GIF, SVG
- **Videos**: MP4, WEBM, MOV, AVI
- **Archives**: ZIP, RAR
- **Others**: TXT, CSV, XLS, XLSX

## 🎯 Alur Kerja Materi

### Upload Process:
1. **Admin Dashboard** → Upload file + metadata
2. **File** → Supabase Storage (bucket: materials)
3. **Metadata** → Firebase Firestore (collection: materials)
4. **Display** → Halaman materi.html

### Download Process:
1. **User** → Klik download di materi.html
2. **Direct link** → Supabase Storage public URL
3. **Browser** → Download file langsung

## 🧪 Testing Checklist

### ✅ Upload Test:
- [ ] Upload PDF file dari admin dashboard
- [ ] Check file muncul di Supabase Storage
- [ ] Check metadata tersimpan di Firebase Firestore
- [ ] Check file muncul di halaman materi.html

### ✅ Download Test:
- [ ] Klik download button di materi.html
- [ ] File berhasil didownload
- [ ] File bisa dibuka dengan benar

### ✅ Display Test:
- [ ] Materi muncul dengan judul dan deskripsi
- [ ] Button download muncul untuk file upload
- [ ] URL link muncul untuk link eksternal
- [ ] Video preview muncul untuk YouTube/video files

## 🚨 Troubleshooting

### File tidak bisa diupload:
1. Check bucket "materials" sudah dibuat
2. Check policies sudah disetup
3. Check API key benar
4. Check network connection

### File tidak muncul di halaman materi:
1. Check Firebase Firestore rules
2. Check materials-service.js
3. Check browser console untuk error
4. Refresh halaman materi

### Download tidak berfungsi:
1. Check file ada di Supabase Storage
2. Check public access policy
3. Check URL format benar
4. Check browser tidak block download
