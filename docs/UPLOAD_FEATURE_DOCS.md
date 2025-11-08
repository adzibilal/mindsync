# 📄 Dokumentasi Fitur Upload Dokumen

## Overview

Fitur upload dokumen di Mindsync memungkinkan user untuk upload berbagai format dokumen yang kemudian akan diproses secara otomatis menggunakan AI untuk membuat knowledge base yang bisa diakses via WhatsApp.

## 🎯 Flow Diagram

```
User Upload File
    ↓
[1] Upload ke Supabase Storage
    ↓
[2] Save metadata ke table `documents` (status: uploaded)
    ↓
[3] Trigger background processing
    ↓
[4] Download file dari storage
    ↓
[5] Extract text berdasarkan format file
    ↓
[6] Split text menjadi chunks (1000 chars, overlap 200)
    ↓
[7] Generate embeddings dengan OpenAI (text-embedding-3-small)
    ↓
[8] Save chunks + embeddings ke `knowledge_base_chunks`
    ↓
[9] Update status dokumen (status: processed)
```

## 📁 Format File yang Didukung

- **PDF** (`.pdf`)
- **Microsoft Word** (`.doc`, `.docx`)
- **Microsoft Excel** (`.xls`, `.xlsx`)
- **CSV** (`.csv`)
- **Text** (`.txt`)
- **Markdown** (`.md`, `.markdown`)

## 🔧 Tech Stack

### Libraries yang Digunakan

1. **pdf-parse** - Extract text dari PDF
2. **mammoth** - Extract text dari DOC/DOCX
3. **xlsx** - Extract text dari Excel/CSV
4. **@langchain/openai** - Generate embeddings dengan OpenAI
5. **openai** - OpenAI SDK

### Installation

```bash
npm install pdf-parse mammoth xlsx openai langchain @langchain/openai
```

## 🗂️ File Structure

```
src/
├── lib/
│   ├── document-processor.ts    # Extract & split text
│   └── embeddings.ts             # Generate OpenAI embeddings
├── app/
│   ├── (admin)/
│   │   └── dashboard/
│   │       └── upload/
│   │           └── page.tsx      # UI upload page
│   └── api/
│       └── documents/
│           ├── upload/
│           │   └── route.ts      # Upload endpoint
│           ├── process/
│           │   └── route.ts      # Processing endpoint
│           ├── status/
│           │   └── [id]/
│           │       └── route.ts  # Check status endpoint
│           └── list/
│               └── route.ts      # List documents endpoint
```

## 🔑 Environment Variables

Tambahkan ke file `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App URL (untuk trigger processing)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Schema

### Table: `documents`

```sql
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_whatsapp_number varchar NOT NULL,
  file_name text NOT NULL,
  status varchar NOT NULL DEFAULT 'uploaded', -- uploaded, processing, processed, failed
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (user_whatsapp_number) REFERENCES users(whatsapp_number)
);
```

### Table: `knowledge_base_chunks`

```sql
CREATE TABLE public.knowledge_base_chunks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id uuid NOT NULL,
  content text NOT NULL,
  embedding vector, -- pgvector extension
  user_whatsapp_number varchar NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
```

### Metadata Structure

```json
{
  "file_name": "document.pdf",
  "chunk_index": 0,
  "start_char": 0,
  "end_char": 1000,
  "word_count": 150,
  "total_chunks": 10,
  "document_metadata": {
    "page_count": 5,
    "total_word_count": 1500,
    "total_char_count": 10000
  }
}
```

## 🚀 API Endpoints

### 1. Upload Document

**POST** `/api/documents/upload`

Upload file dan trigger processing.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File (max 10MB)
  - `whatsapp_number`: string

**Response:**
```json
{
  "success": true,
  "message": "File berhasil diupload! Lagi diproses nih, tunggu sebentar ya 🎉",
  "data": {
    "id": "uuid",
    "fileName": "document.pdf",
    "status": "uploaded",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Process Document

**POST** `/api/documents/process`

Process dokumen (extract, chunk, embed).

**Request:**
```json
{
  "documentId": "uuid",
  "fileName": "document.pdf",
  "whatsappNumber": "6281234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dokumen berhasil diproses! 🎉",
  "data": {
    "documentId": "uuid",
    "chunksCount": 10,
    "totalWords": 1500,
    "totalChars": 10000,
    "pageCount": 5
  }
}
```

### 3. Check Status

**GET** `/api/documents/status/:id`

Cek status processing dokumen.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileName": "document.pdf",
    "status": "processed",
    "uploadedAt": "2024-01-01T00:00:00Z",
    "chunksCount": 10,
    "statusMessage": "Dokumen sudah siap! Bisa ditanya lewat WhatsApp 🎉"
  }
}
```

### 4. List Documents

**GET** `/api/documents/list?whatsapp_number=6281234567890`

Ambil daftar semua dokumen user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "file_name": "document.pdf",
      "status": "processed",
      "uploaded_at": "2024-01-01T00:00:00Z",
      "chunksCount": 10
    }
  ]
}
```

## 🎨 UI Features

### Upload Page (`/dashboard/upload`)

**Fitur:**
- ✅ Drag & drop file upload
- ✅ Multiple file selection
- ✅ Real-time upload progress
- ✅ Status tracking (uploading → processing → processed)
- ✅ File preview dengan icon sesuai type
- ✅ Individual atau bulk upload
- ✅ Remove file dari daftar
- ✅ Auto-polling untuk status processing
- ✅ Toast notifications
- ✅ Dark mode support

**Status Flow:**
1. **Pending** - File ready untuk diupload
2. **Uploading** - File sedang diupload ke storage
3. **Processing** - File sedang diproses (extract + embed)
4. **Processed** - File siap digunakan ✨
5. **Error** - Ada kesalahan dalam proses

## ⚙️ Configuration

### Chunking Strategy

```typescript
// Default configuration
const CHUNK_SIZE = 1000;      // 1000 characters per chunk
const CHUNK_OVERLAP = 200;    // 200 characters overlap
```

**Kenapa overlap?**
- Menjaga konteks antar chunks
- Mencegah kehilangan informasi di boundaries
- Meningkatkan kualitas search/retrieval

### OpenAI Embeddings

```typescript
// Model yang digunakan
const MODEL = "text-embedding-3-small";

// Dimensi: 1536
// Cost: $0.00002 per 1K tokens
```

## 🔄 Background Processing

Processing dilakukan secara **asynchronous** (non-blocking):

1. Upload API langsung return response setelah file tersimpan
2. Processing di-trigger via internal API call (background)
3. User bisa monitoring via polling atau websocket
4. Status update real-time di UI

**Keuntungan:**
- User tidak perlu menunggu processing selesai
- Better UX (no timeout issues)
- Scalable untuk dokumen besar

## 🛠️ Error Handling

### Validasi

1. **File size**: Max 10MB
2. **File type**: Hanya format yang didukung
3. **Empty document**: Skip jika dokumen kosong
4. **Processing timeout**: Max 5 menit (30 polls × 10s)

### Rollback Strategy

Jika terjadi error:
1. Update status dokumen menjadi `failed`
2. Cleanup uploaded file dari storage (jika perlu)
3. Show error message ke user
4. Allow retry upload

## 📈 Performance Optimization

### Batch Processing

```typescript
// Generate embeddings untuk semua chunks sekaligus
const embeddings = await generateEmbeddings(chunkTexts);

// Insert chunks ke database dalam satu query
await supabase.from("knowledge_base_chunks").insert(knowledgeChunks);
```

### Polling Strategy

- **Interval**: 10 detik
- **Max attempts**: 30 (5 menit total)
- **Start delay**: 5 detik (give time for processing to start)

## 🎯 Best Practices

### 1. Document Preparation

- Upload dokumen dengan struktur yang jelas
- Gunakan heading dan paragraph yang baik
- Hindari dokumen dengan terlalu banyak gambar

### 2. Chunking

- Adjust chunk size sesuai kebutuhan
- Untuk dokumen teknis: gunakan chunk lebih besar (1500-2000)
- Untuk conversational: gunakan chunk lebih kecil (500-800)

### 3. Metadata

- Simpan metadata yang relevan
- Gunakan untuk filtering dan search
- Include document context (title, author, date, etc.)

## 🐛 Troubleshooting

### Issue: PDF tidak bisa di-extract

**Solution:**
- Pastikan PDF tidak password-protected
- Check apakah PDF adalah image-based (butuh OCR)
- Try re-export PDF dari source document

### Issue: Processing timeout

**Solution:**
- Dokumen terlalu besar, split menjadi beberapa file
- Check OpenAI API quota/rate limit
- Increase polling timeout

### Issue: Embeddings failed

**Solution:**
- Verify OPENAI_API_KEY valid
- Check API quota remaining
- Check network connectivity

## 📝 Testing

### Manual Testing

1. Upload berbagai format file
2. Check status processing
3. Verify chunks tersimpan di database
4. Test error scenarios (file too large, invalid format)

### Automated Testing (TODO)

```typescript
// TODO: Add unit tests
// TODO: Add integration tests
// TODO: Add E2E tests
```

## 🚀 Future Improvements

- [ ] Support lebih banyak format (images dengan OCR, audio, video)
- [ ] Websocket untuk real-time status update
- [ ] Batch upload multiple files sekaligus
- [ ] Document versioning
- [ ] Custom chunking strategy per user
- [ ] Preview dokumen sebelum upload
- [ ] Document analytics (most used, etc.)

## 🎯 Setup Requirements

### 1. Supabase Storage Bucket

Pastikan bucket `mindsync_storage` sudah dibuat dengan settings:
- **Bucket name**: `mindsync_storage`
- **Public**: false (private bucket)
- **File size limit**: 10MB
- **Allowed MIME types**: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, MD

### 2. Environment Variables

Tambahkan ke file `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

- Enable pgvector extension untuk vector storage
- Pastikan tables `documents` dan `knowledge_base_chunks` sudah dibuat

## 📚 References

- [pdf-parse documentation](https://www.npmjs.com/package/pdf-parse)
- [mammoth documentation](https://www.npmjs.com/package/mammoth)
- [LangChain documentation](https://js.langchain.com/docs/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)

---

**Created by**: Mindsync Team 🚀  
**Last Updated**: October 2024

