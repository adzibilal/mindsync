# File Upload Service Implementation - Complete

## Overview

Successfully implemented a file upload service that replicates the n8n workflow with the following features:

- **Cloudinary Storage**: Files are now uploaded to Cloudinary instead of Supabase Storage
- **OCR Processing**: Images (PNG/JPG) are processed using Tesseract.js for text extraction
- **Vector Embeddings**: Document chunks are stored in Supabase `documents` table with OpenAI embeddings
- **Unified Processing**: All file types (PDF, DOCX, TXT, CSV, XLSX, PNG, JPG) are supported

## What Was Implemented

### 1. New Dependencies Installed ✅
```bash
- cloudinary: Cloudinary SDK for file uploads
- node-fetch@2: For downloading files from Cloudinary
```

**Note:** OCR now uses OpenAI Vision API (gpt-4o-mini) instead of Tesseract.js for better reliability and Next.js compatibility.

### 2. New Services Created ✅

#### Cloudinary Service (`src/lib/cloudinary.ts`)
- `uploadFileToCloudinary()`: Upload files to Cloudinary
- `deleteFileFromCloudinary()`: Delete files from Cloudinary
- `getCloudinaryUrl()`: Get secure URLs

#### OCR Service (`src/lib/ocr.ts`)
- `extractTextFromImage()`: Extract text from PNG/JPG using OpenAI Vision API (gpt-4o-mini)
- `isOCRSupportedImage()`: Check if file supports OCR
- `detectImageMimeType()`: Auto-detect image format from buffer

### 3. Updated Document Processor ✅
Modified `src/lib/document-processor.ts`:
- Added OCR support for PNG/JPG images
- Images are now processed before other document types
- Unified text extraction for all file types

### 4. Rewritten API Endpoints ✅

#### Upload Endpoint (`src/app/api/documents/upload/route.ts`)
**Flow:**
1. Receive file via FormData
2. Validate file type (including PNG/JPG)
3. Upload to Cloudinary (folder: `mindsync/{whatsapp_number}/`)
4. Save metadata to `documents_details` table with Cloudinary URL
5. Trigger async processing
6. Return success response

**Key Changes:**
- Replaced Supabase Storage with Cloudinary
- Added support for image/png and image/jpeg
- Store `file_url` with Cloudinary secure URL

#### Process Endpoint (`src/app/api/documents/process/route.ts`)
**Flow:**
1. Download file from Cloudinary URL
2. Detect if file is an image (PNG/JPG)
3. **If image**: Use OCR to extract text
4. **If not image**: Use existing extraction (PDF, DOCX, etc.)
5. Split text into chunks (1000 chars with 200 overlap)
6. Generate OpenAI embeddings for all chunks
7. Store in `documents` table (vector store)

**Vector Store Structure:**
```typescript
{
  content: string,           // Chunk text
  metadata: {
    whatsapp_number: string,
    file_name: string,
    document_id: uuid,
    chunk_index: number,
    word_count: number,
    total_chunks: number,
    // ... other metadata
  },
  embedding: vector         // OpenAI embedding
}
```

### 5. Updated Upload Page ✅
Modified `src/app/(admin)/dashboard/upload/page.tsx`:
- Removed external webhook call
- Now uses internal `/api/documents/upload` endpoint
- Simplified upload process

## Environment Setup Required

### Add to `.env.local`:

```env
# Cloudinary Configuration (Required)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### How to Get Cloudinary Credentials:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Supported File Types

### Documents (Text Extraction)
- PDF (`.pdf`)
- Word Documents (`.doc`, `.docx`)
- Text Files (`.txt`, `.md`, `.markdown`)
- CSV Files (`.csv`)
- Excel Files (`.xls`, `.xlsx`)

### Images (OCR Processing)
- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)

## Processing Flow

```
User Upload
    ↓
Upload to Cloudinary
    ↓
Save Metadata (documents_details)
    ↓
Async Processing Triggered
    ↓
Download from Cloudinary
    ↓
[Check File Type]
    ↓
Image? → Yes → OCR (Tesseract.js) → Text
       ↓ No
Document → Extract Text (PDF/DOCX/etc) → Text
    ↓
Split into Chunks
    ↓
Generate Embeddings (OpenAI)
    ↓
Store in Vector DB (documents table)
    ↓
Update Status to "processed"
```

## Database Tables Used

### `documents_details`
Stores file metadata:
- `id`: UUID (primary key)
- `user_whatsapp_number`: varchar
- `file_name`: text
- `status`: enum (uploaded, processing, processed, failed)
- `uploaded_at`: timestamp
- `file_url`: text (Cloudinary URL)

### `documents`
Vector store for embeddings:
- `id`: bigint (primary key)
- `content`: text (chunk content)
- `metadata`: jsonb (includes whatsapp_number, file_name, document_id)
- `embedding`: vector (OpenAI embedding)

## Key Features Matching n8n Flow

✅ Upload to Cloudinary instead of Supabase Storage
✅ OCR processing for images (PNG/JPG)
✅ Vector embeddings with OpenAI
✅ Metadata-based filtering by whatsapp_number
✅ Status tracking (uploaded → processing → processed/failed)
✅ Async processing (non-blocking uploads)
✅ Proper error handling and rollback

## Testing Checklist

- [ ] Set Cloudinary environment variables
- [ ] Test PDF upload
- [ ] Test DOCX upload
- [ ] Test PNG image upload with OCR
- [ ] Test JPG image upload with OCR
- [ ] Test TXT file upload
- [ ] Verify files appear in Cloudinary dashboard
- [ ] Verify embeddings stored in `documents` table
- [ ] Verify metadata in `documents_details` table
- [ ] Test error handling (invalid file, too large, etc.)

## Next Steps

1. **Add Cloudinary credentials** to your `.env.local` file
2. **Restart the development server**: `npm run dev`
3. **Test file uploads** through the upload page
4. **Monitor processing** in the documents list page

## Notes

- Maximum file size: 10MB
- OCR engine: OpenAI Vision API (gpt-4o-mini) - multilingual support
- OCR quality: Very high accuracy, better than traditional OCR
- Chunk size: 1000 characters with 200 character overlap
- Embedding model: `text-embedding-3-small` (OpenAI)
- Files are organized in Cloudinary by WhatsApp number

## Troubleshooting

### "Missing Cloudinary environment variables"
- Ensure all three Cloudinary variables are set in `.env.local`
- Restart the development server

### "OCR extraction failed"
- Check image quality (clear, readable)
- Ensure image contains text
- Verify OpenAI API key is valid and has Vision API access
- Check OpenAI API quota/billing

### "Embedding generation failed"
- Verify OpenAI API key is valid
- Check OpenAI API quota/billing
- Ensure text chunks are not empty

## Architecture Benefits

1. **Scalable Storage**: Cloudinary handles CDN and optimization
2. **Smart Processing**: Automatic image detection and OCR
3. **Vector Search**: Embeddings enable semantic search
4. **Async Processing**: Non-blocking uploads improve UX
5. **Error Recovery**: Status tracking enables retry logic

