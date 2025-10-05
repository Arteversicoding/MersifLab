# 🔧 Cara Update Firestore Rules untuk Admin Dashboard

## ❌ Masalah yang Terjadi
Error: `Missing or insufficient permissions` pada admin dashboard karena Firestore rules tidak mengizinkan admin membaca semua collection untuk statistik.

## ✅ Solusi: Update Firestore Rules

### Langkah 1: Buka Firebase Console
1. Pergi ke [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Mersiflab Anda
3. Di sidebar kiri, klik **Firestore Database**
4. Klik tab **Rules**

### Langkah 2: Replace Rules
Ganti semua rules yang ada dengan rules baru ini:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function untuk cek admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Rules untuk collection users
    match /users/{userId} {
      // Semua orang bisa baca profile user
      allow read: if true;
      // Hanya user yang login bisa buat profile
      allow create: if request.auth != null;
      // Hanya owner atau admin yang bisa update/delete
      allow update, delete: if request.auth != null &&
        (request.auth.uid == userId || isAdmin());
    }

    // Rules untuk collection posts (forum)
    match /posts/{postId} {
      // Semua orang bisa baca postingan
      allow read: if true;

      // Hanya user yang login bisa membuat postingan
      allow create: if request.auth != null &&
        request.resource.data.authorId == request.auth.uid;

      // Hanya pemilik postingan atau admin yang bisa update/delete
      allow update: if request.auth != null &&
        (resource.data.authorId == request.auth.uid || isAdmin());

      allow delete: if request.auth != null &&
        (resource.data.authorId == request.auth.uid || isAdmin());
    }

    // Rules untuk collection materials (materi)
    match /materials/{materialId} {
      // Semua orang bisa baca materi
      allow read: if true;

      // Hanya admin yang bisa create/update/delete materi
      allow create, update, delete: if isAdmin();
    }

    // Rules untuk collection feedback (survey responses)
    match /feedback/{feedbackId} {
      // Admin bisa baca semua feedback
      allow read: if isAdmin();
      // User yang login bisa buat feedback
      allow create: if request.auth != null;
      // Hanya admin yang bisa update/delete feedback
      allow update, delete: if isAdmin();
    }

    // Rules untuk collection forum (jika masih ada yang pakai nama ini)
    match /forum/{forumId} {
      // Semua orang bisa baca
      allow read: if true;
      // User yang login bisa buat
      allow create: if request.auth != null;
      // Admin atau owner bisa update/delete
      allow update, delete: if request.auth != null &&
        (resource.data.authorId == request.auth.uid || isAdmin());
    }

    // Default: deny all untuk collection lain
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Langkah 3: Publish Rules
1. Klik tombol **Publish** 
2. Tunggu beberapa detik sampai rules ter-deploy

## 🔍 Perubahan Utama

### ✅ Yang Diperbaiki:
- **Helper function `isAdmin()`** - Lebih clean dan reusable
- **Collection name consistency** - Menggunakan `posts` bukan `forum`
- **Admin read access** - Admin bisa baca semua collection untuk dashboard
- **Better error handling** - Stats service sekarang handle permission errors

### 📊 Collection Mapping:
- **Users**: `users` collection
- **Forum Posts**: `posts` collection (bukan `forum`)
- **Materials**: `materials` collection  
- **Feedback**: `feedback` collection (untuk survey)

## 🧪 Testing
Setelah update rules:
1. Login sebagai admin
2. Buka admin dashboard
3. Stats seharusnya muncul tanpa error
4. Check browser console - tidak ada error permission lagi

## 🚨 Troubleshooting
Jika masih error:
1. **Clear browser cache** dan refresh
2. **Logout dan login ulang** sebagai admin
3. **Check console** untuk error lain
4. **Verify admin role** di Firestore users collection
