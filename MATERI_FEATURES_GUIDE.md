# 📚 Panduan Fitur Materi Mersiflab

## 🎯 Fitur Baru: Dual Button System

### **Tombol "Buka Materi" vs "Download File"**

#### **🔵 Buka Materi** (Biru/Cyan)
- **Fungsi**: Preview/view file di browser
- **Target**: `target="_blank"` - buka di tab baru
- **Use case**: 
  - PDF → Preview di browser
  - Images → Tampil langsung
  - Documents → Preview jika browser support
  - Videos → Play langsung

#### **🟢 Download File** (Hijau)
- **Fungsi**: Download file ke device
- **Attribute**: `download` - force download
- **Use case**:
  - Simpan file ke komputer/phone
  - Offline access
  - Backup materi

## 📁 File Type Detection & Preview

### **📄 PDF Files**
- **Preview**: Info card dengan icon PDF
- **Buka Materi**: Preview PDF di browser
- **Download**: Unduh file PDF
- **Visual**: Red/orange gradient card

### **🖼️ Image Files** 
- **Supported**: JPG, PNG, GIF, WebP, SVG
- **Preview**: Thumbnail image langsung tampil
- **Buka Materi**: View full size di tab baru
- **Download**: Unduh file gambar

### **📄 Office Documents**
- **Supported**: DOC, DOCX, PPT, PPTX, XLS, XLSX
- **Preview**: Info card dengan icon document
- **Buka Materi**: Preview jika browser support
- **Download**: Unduh file document
- **Visual**: Blue/cyan gradient card

### **🎥 Videos**
- **YouTube**: Embedded player langsung
- **Uploaded Videos**: HTML5 video player
- **Supported**: MP4, WebM, MOV, AVI
- **No dual buttons**: Langsung play

### **🔗 External Links**
- **Dual buttons**: Tetap ada
- **Buka Materi**: Buka link di tab baru
- **Download**: Coba download (tergantung link)

## 🎨 UI/UX Design

### **Button Layout**
```
[Buka Materi] [Download File]
     (Biru)      (Hijau)
```

### **Responsive Design**
- **Desktop**: 2 tombol side-by-side
- **Mobile**: 2 tombol stacked (vertical)
- **Flex layout**: `flex-col sm:flex-row`

### **Visual Hierarchy**
1. **Title & Description** (paling atas)
2. **File Type Preview** (jika ada)
3. **Action Buttons** (bawah)

## 🔧 Technical Implementation

### **File Type Detection**
```javascript
const isPDF = downloadUrl && downloadUrl.toLowerCase().includes('.pdf');
const isImage = downloadUrl && ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].some(ext => downloadUrl.toLowerCase().includes(ext));
const isDocument = downloadUrl && ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'].some(ext => downloadUrl.toLowerCase().includes(ext));
```

### **Button Generation**
```javascript
// Buka Materi - target="_blank"
<a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">

// Download File - download attribute
<a href="${downloadUrl}" download>
```

### **Preview Cards**
- **PDF**: Red gradient dengan PDF icon
- **Documents**: Blue gradient dengan document icon
- **Images**: Direct thumbnail display
- **Videos**: Embedded players

## 📱 User Experience Flow

### **Scenario 1: PDF Upload**
1. **Admin** upload "Buku IPAS.pdf"
2. **User** lihat di halaman materi
3. **Preview**: Red card "📄 File PDF"
4. **Buka Materi**: PDF preview di browser
5. **Download File**: Unduh ke device

### **Scenario 2: Image Upload**
1. **Admin** upload "Diagram AI.png"
2. **User** lihat di halaman materi
3. **Preview**: Thumbnail image langsung
4. **Buka Materi**: Full size image
5. **Download File**: Unduh gambar

### **Scenario 3: External Link**
1. **Admin** input link "https://example.com/course"
2. **User** lihat di halaman materi
3. **Buka Materi**: Buka website di tab baru
4. **Download File**: Coba download (mungkin gagal)

## 🎯 Benefits

### **For Students**
- ✅ **Quick preview** tanpa download
- ✅ **Offline access** via download
- ✅ **Clear visual cues** untuk file types
- ✅ **Mobile-friendly** responsive design

### **For Admins**
- ✅ **Flexible upload** - file atau link
- ✅ **Auto file detection** - no manual setup
- ✅ **Consistent UI** untuk semua file types
- ✅ **Real-time updates** via Firebase

## 🚀 Future Enhancements

### **Possible Additions**
- 📊 **File size display**
- ⏱️ **Upload date/time**
- 👁️ **View count tracking**
- ⭐ **Rating system**
- 💬 **Comments per materi**
- 🔍 **Advanced search filters**
- 📂 **Category/tags system**

### **Technical Improvements**
- 🔄 **Progressive loading** untuk large files
- 📱 **Better mobile preview** untuk documents
- 🎨 **Custom thumbnails** untuk videos
- 🔐 **Access control** per materi
- 📈 **Analytics** untuk usage tracking
