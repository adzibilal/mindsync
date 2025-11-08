# MINDSYNC: Platform Manajemen Dokumen Berbasis AI dan WhatsApp

---

## Informasi Mahasiswa

**Nama:** Adzi Bilal Maulana H  
**NIM:** 22552011164  
**Program Studi:** Teknik Informatika  
**Judul Proyek:** MINDSYNC - AI-Powered Document Management via WhatsApp

**Tanggal Penyusunan:** November 2025

---

## RINGKASAN EKSEKUTIF

### Gambaran Umum Proyek

MINDSYNC adalah platform inovatif untuk manajemen dokumen berbasis kecerdasan buatan (AI) yang mengintegrasikan WhatsApp sebagai antarmuka utama interaksi pengguna. Platform ini dikembangkan untuk mengatasi masalah inefisiensi dalam pengelolaan dokumen di dunia kerja modern, di mana menurut data IDC, pekerja menghabiskan 50% waktu untuk mencari informasi, 30% untuk mempersiapkan data, dan 20% terbuang karena duplikasi pekerjaan.

### Tujuan Proyek

MINDSYNC bertujuan untuk:

1. **Menyederhanakan Manajemen Dokumen**: Mengubah proses pencarian dan pengelolaan dokumen menjadi percakapan alami melalui WhatsApp
2. **Meningkatkan Produktivitas**: Mengurangi waktu yang terbuang untuk mencari informasi dengan sistem retrieval berbasis AI
3. **Demokratisasi Akses AI**: Membuat teknologi RAG (Retrieval-Augmented Generation) dapat diakses melalui platform yang familiar (WhatsApp)
4. **Membangun "Second Brain"**: Menciptakan sistem knowledge base personal yang dapat diakses kapan saja

### Fitur Utama

1. **Upload Multi-Format**: Mendukung PDF, DOCX, TXT, CSV, XLSX, PNG, JPG dengan processing otomatis
2. **AI Conversational Chat**: Interaksi natural dengan dokumen melalui WhatsApp menggunakan teknologi RAG
3. **OCR Cerdas**: Ekstraksi teks dari gambar menggunakan OpenAI Vision API
4. **Vector Search**: Pencarian semantik dengan embedding dan similarity matching
5. **Custom AI Persona**: Kustomisasi kepribadian AI sesuai preferensi pengguna
6. **Multi-tenancy**: Isolasi data per pengguna dengan keamanan tingkat tinggi
7. **Admin Dashboard**: Antarmuka web untuk manajemen dokumen dan monitoring

### Teknologi Utama

- **Frontend**: Next.js 15.5.4, React 19, TypeScript, Tailwind CSS
- **Backend**: n8n workflow automation, Supabase (PostgreSQL + pgvector)
- **AI/ML**: OpenAI GPT-4-mini, text-embedding-3-small, Vision API
- **Integration**: WAHA (WhatsApp HTTP API), Cloudinary storage
- **Authentication**: JWT dengan OTP verification via WhatsApp

### Pencapaian Utama

1. **Arsitektur Hybrid**: Kombinasi Next.js web app dengan n8n workflow engine untuk fleksibilitas maksimal
2. **RAG Implementation**: Implementasi lengkap Retrieval-Augmented Generation dengan hierarchical priority system
3. **Real-time Processing**: Asynchronous document processing dengan status tracking real-time
4. **Production-Ready**: Multi-tenancy, security, error handling, dan scalability built-in
5. **WhatsApp Native**: Integrasi mendalam dengan WhatsApp untuk pengalaman pengguna yang seamless

### Target Pasar

- **TAM (Total Addressable Market)**: 214 juta penduduk Indonesia usia 18-60 tahun
- **SAM (Serviceable Addressable Market)**: 143 juta pekerja yang bergantung pada dokumentasi
- **SOM (Serviceable Obtainable Market)**: 87,9 juta pekerja formal di Indonesia

---

## DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [Permasalahan](#2-permasalahan)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Technology Stack](#4-technology-stack)
5. [Desain Database](#5-desain-database)
6. [Sistem Autentikasi](#6-sistem-autentikasi)
7. [Upload dan Processing Dokumen](#7-upload-dan-processing-dokumen)
8. [Vector Embeddings dan RAG](#8-vector-embeddings-dan-rag)
9. [n8n Workflow Engine](#9-n8n-workflow-engine)
10. [Integrasi WhatsApp](#10-integrasi-whatsapp)
11. [Fitur Cameo Personas](#11-fitur-cameo-personas)
12. [Admin Dashboard](#12-admin-dashboard)
13. [Dokumentasi API](#13-dokumentasi-api)
14. [Keamanan dan Multi-tenancy](#14-keamanan-dan-multi-tenancy)
15. [User Flows dan Use Cases](#15-user-flows-dan-use-cases)
16. [Pertimbangan Performa](#16-pertimbangan-performa)
17. [Error Handling](#17-error-handling)
18. [Konfigurasi dan Deployment](#18-konfigurasi-dan-deployment)
19. [Testing dan Validasi](#19-testing-dan-validasi)
20. [Future Improvements](#20-future-improvements)
21. [Kesimpulan](#21-kesimpulan)
22. [Referensi](#22-referensi)

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang

Dalam era digital modern, volume dokumen dan informasi yang harus dikelola oleh pekerja professional terus meningkat secara eksponensial. Penelitian oleh International Data Corporation (IDC) menunjukkan statistik yang mengkhawatirkan tentang inefisiensi dalam manajemen dokumen:

- **50% waktu kerja** dihabiskan untuk mencari informasi
- **30% waktu** digunakan untuk mempersiapkan dan menyiapkan data
- **20% waktu** terbuang akibat duplikasi pekerjaan

Masalah ini menyebabkan frustasi bagi pekerja, menghambat kolaborasi yang efektif, dan membuat metode manajemen dokumen tradisional terasa usang dan tidak efisien.

### 1.2 Motivasi

Tantangan utama dalam manajemen dokumen modern adalah:

1. **Fragmentasi Informasi**: Dokumen tersebar di berbagai platform dan folder
2. **Pencarian Ineffektif**: Sistem pencarian tradisional berbasis keyword tidak memahami konteks
3. **Aksesibilitas Terbatas**: Tidak ada cara cepat untuk mengakses informasi saat mobile
4. **Kurangnya Konteks**: Pencarian tidak mempertimbangkan histori dan preferensi pengguna

WhatsApp, dengan 86 juta pengguna aktif di Indonesia, menawarkan solusi ideal sebagai antarmuka yang:
- **Familiar**: Sudah digunakan sehari-hari
- **Mobile-first**: Dapat diakses kapan saja, di mana saja
- **Real-time**: Mendukung komunikasi instan
- **Universal**: Tidak memerlukan training khusus

### 1.3 Tujuan Sistem

Mindsync dikembangkan dengan tujuan utama:

1. **Menyederhanakan Kolaborasi**: Membuat proses berbagi dan mencari dokumen semudah chatting
2. **Meningkatkan Produktivitas**: Mengurangi waktu yang terbuang untuk pencarian informasi
3. **Demokratisasi AI**: Membuat teknologi AI dan machine learning dapat diakses melalui interface sederhana
4. **Second Brain Concept**: Membangun sistem eksternal memory yang dapat diandalkan

### 1.4 Ruang Lingkup

Proyek Mindsync mencakup:

**Lingkup Teknis:**
- Web application (Admin Dashboard) menggunakan Next.js
- WhatsApp integration via WAHA API
- Document processing pipeline dengan AI
- Vector database untuk semantic search
- n8n workflow automation engine
- Multi-tenant architecture

**Lingkup Fungsional:**
- User registration dan authentication
- Document upload (web dan WhatsApp)
- Automated text extraction dan processing
- AI-powered conversational interface
- Custom persona management
- Real-time status monitoring

**Batasan:**
- Maksimal ukuran file: 10MB per dokumen
- Format didukung: PDF, DOCX, TXT, CSV, XLSX, PNG, JPG
- Bahasa utama: Indonesia dan Inggris
- Platform: WhatsApp only (no Telegram, Line, etc.)

### 1.5 Manfaat

**Untuk Pengguna Individual:**
- Akses cepat ke knowledge base personal via WhatsApp
- Tidak perlu mengingat lokasi file spesifik
- Pencarian berbasis konteks dan semantic meaning
- Productive chatting dengan dokumen

**Untuk Organisasi:**
- Mengurangi time waste dalam pencarian informasi
- Meningkatkan efisiensi tim
- Knowledge retention yang lebih baik
- Scalable document management

**Untuk Penelitian:**
- Implementasi praktis dari RAG (Retrieval-Augmented Generation)
- Studi kasus integrasi AI dengan platform messaging
- Arsitektur multi-tenant untuk SaaS application
- Hybrid approach: web app + workflow automation

---

## 2. PERMASALAHAN

### 2.1 Identifikasi Masalah

#### 2.1.1 Problem Statement

Pekerja modern menghadapi tantangan signifikan dalam manajemen dokumen:

**Masalah Pencarian:**
- Sistem pencarian tradisional hanya cocok dengan keyword eksak
- Tidak memahami konteks atau makna semantik
- Sulit menemukan informasi jika tidak ingat kata kunci yang tepat
- Pencarian across multiple files sangat memakan waktu

**Masalah Aksesibilitas:**
- Dokumen tersimpan di berbagai lokasi (laptop, cloud, email)
- Tidak ada unified interface untuk akses
- Sulit diakses saat mobile atau di perjalanan
- Memerlukan aplikasi khusus untuk membuka berbagai format

**Masalah Produktivitas:**
- Switching context antar aplikasi mengurangi fokus
- Time waste mencari informasi yang pernah dibaca
- Duplikasi effort karena informasi sulit ditemukan
- Kolaborasi terhambat karena sharing dokumen tidak efisien

#### 2.1.2 Analisis Pasar

Berdasarkan data dari Kadin.id (Februari 2024):

**Total Addressable Market (TAM):**
- 214 juta penduduk Indonesia (usia 18-60 tahun)
- Smartphone penetration >70%
- WhatsApp adoption rate tinggi

**Serviceable Addressable Market (SAM):**
- 143 juta pekerja yang bergantung pada dokumentasi
- Knowledge workers, professionals, akademisi
- UKM dan corporate employees

**Serviceable Obtainable Market (SOM):**
- 87,9 juta pekerja formal di Indonesia
- Menghadapi tantangan workflow tidak efisien
- Target utama untuk early adoption

### 2.2 Analisis Pengguna

#### 2.2.1 Persona Pengguna Ideal

Berdasarkan analisis kebutuhan, 10 persona ideal MINDSYNC:

**1. Rina - Mahasiswa Pascasarjana**
- **Masalah**: Ratusan jurnal ilmiah dan catatan kuliah dalam PDF, sulit mengingat lokasi teori atau kutipan spesifik
- **Solusi Mindsync**: Upload semua file, bertanya "Di jurnal mana yang membahas 'cognitive dissonance' oleh Festinger?" - instant answer
- **Value**: Time saving untuk research, better citation management

**2. Bagus - Manajer Pemasaran Startup**
- **Masalah**: Brief tim produk, riset pasar, data performa tersebar di Google Drive, time waste di tengah meeting
- **Solusi Mindsync**: Tanya "Berapa engagement rate kampanye Q3?" tanpa buka banyak tab
- **Value**: Quick access to metrics, better decision making

**3. Sari - Pengacara Junior**
- **Masalah**: Review kontrak tebal, sulit find pasal/klausul spesifik dalam 50 halaman
- **Solusi Mindsync**: "Tunjukkan semua pasal tentang penyelesaian sengketa dalam kontrak PT ABC"
- **Value**: Efisiensi legal review, no missed clauses

**4. Dian - Penulis Konten Freelance**
- **Masalah**: 5 klien berbeda, masing-masing dengan style guide dan feedback di email/folder terpisah
- **Solusi Mindsync**: "Apa feedback klien X untuk draf artikel terakhir?"
- **Value**: Easy project switching, consistent quality

**5. Agus - Pemilik Kedai Kopi (UKM)**
- **Masalah**: Invoice, kontrak sewa, SOP untuk barista - dokumentasi manual
- **Solusi Mindsync**: Via WhatsApp "Kapan jatuh tempo sewa ruko?"
- **Value**: Organized business documents, accessible anywhere

**6. Dr. Indah - Dosen dan Peneliti**
- **Masalah**: Materi 3 mata kuliah, bank soal, puluhan jurnal penelitian
- **Solusi Mindsync**: "Sebutkan referensi untuk mata kuliah Metodologi Penelitian"
- **Value**: Efficient teaching prep, better research organization

**7. Fajar - Manajer Produk**
- **Masalah**: PRD, notulen rapat, feedback pengguna - butuh quick access saat diskusi
- **Solusi Mindsync**: "Apa prioritas fitur dari sprint planning minggu lalu?"
- **Value**: Faster decisions, better team alignment

**8. Chandra - Konsultan Keuangan**
- **Masalah**: Portofolio multiple clients, polis asuransi, laporan investasi berbeda-beda
- **Solusi Mindsync**: "Tunjukkan rincian polis asuransi kesehatan klien B"
- **Value**: Professional client service, quick consultations

**9. Maya - Event Organizer**
- **Masalah**: Multiple events parallel, proposal, kontrak vendor, rundown tersebar
- **Solusi Mindsync**: "Siapa PIC vendor sound system acara pernikahan besok?"
- **Value**: On-field access, zero confusion

**10. Hadi - Penggiat Personal Knowledge Management**
- **Masalah**: Artikel, kutipan buku, catatan pribadi - "second brain" terlalu besar untuk navigasi
- **Solusi Mindsync**: "Apa yang pernah saya simpan tentang 'stoicism'?"
- **Value**: True second brain implementation

### 2.3 Competitive Analysis

#### 2.3.1 Kompetitor Existing

**1. ChatPDF**
- **Kelebihan**: Fokus pada PDF, interface web simple
- **Kekurangan**: Terbatas pada PDF only, no WhatsApp, no multi-doc search
- **Gap**: Tidak mobile-friendly, satu dokumen per session

**2. Arches AI**
- **Kelebihan**: Document Q&A dengan AI
- **Kekurangan**: Subscription mahal, web-only, no Indonesia support
- **Gap**: No WhatsApp, tidak familiar untuk Indonesian market

**3. Lark (ByteDance)**
- **Kelebihan**: All-in-one workspace, document collaboration
- **Kekurangan**: Complex UI, perlu training, heavyweight app
- **Gap**: Overkill untuk individual users, no WhatsApp integration

#### 2.3.2 Keunggulan Kompetitif Mindsync

**1. WhatsApp Integration**
- Platform dengan 86 juta pengguna aktif di Indonesia
- No additional app needed
- Familiar interface, zero learning curve
- Mobile-first by nature

**2. Bahasa Indonesia Native Support**
- AI yang memahami konteks Bahasa Indonesia
- Natural conversation dalam bahasa lokal
- Relevant untuk Indonesian market

**3. Multi-Format Support**
- Tidak terbatas pada PDF
- Images dengan OCR cerdas (OpenAI Vision)
- Office documents (DOCX, XLSX)
- Text dan Markdown files

**4. Affordable dan Scalable**
- Open source stack (n8n, Supabase)
- Pay-per-use model untuk AI
- Self-hosted option available

**5. Custom AI Persona**
- User dapat customize personality AI
- Flexible untuk berbagai use case
- Professional atau casual tone

### 2.4 Justifikasi Solusi

**Mengapa WhatsApp?**
- **Adoption Rate**: Sudah digunakan 86 juta orang di Indonesia
- **Low Friction**: No new app to install
- **Cross-Platform**: Android, iOS, Web seamless
- **Reliable**: Proven infrastructure

**Mengapa RAG (vs Fine-tuning)?**
- **Up-to-date**: Dokumen baru langsung available
- **Cost-effective**: No expensive retraining
- **Transparent**: Dapat trace sumber informasi
- **Privacy**: Data tidak masuk training model

**Mengapa Hybrid Architecture (Next.js + n8n)?**
- **Best of Both Worlds**: Rich UI untuk admin, flexible automation untuk workflows
- **Separation of Concerns**: Frontend terpisah dari business logic
- **Maintainability**: Mudah debug dan modify
- **Scalability**: Komponen independen dapat di-scale terpisah

---

## 3. ARSITEKTUR SISTEM

### 3.1 Gambaran Arsitektur High-Level

MINDSYNC mengimplementasikan arsitektur hybrid yang menggabungkan modern web application dengan workflow automation engine. Arsitektur ini dirancang dengan prinsip:

- **Separation of Concerns**: UI layer terpisah dari business logic
- **Microservices-like**: Komponen independen yang berkomunikasi via API
- **Event-Driven**: Async processing dengan webhook dan triggers
- **Multi-tenant**: Isolasi data per user dengan metadata filtering

#### 3.1.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                    ┌──────────────┐          │
│  │   WhatsApp   │◄───────────────────┤  Web Browser │          │
│  │   (Mobile)   │                    │  (Desktop)   │          │
│  └──────┬───────┘                    └──────┬───────┘          │
│         │                                   │                  │
└─────────┼───────────────────────────────────┼──────────────────┘
          │                                   │
          │ WAHA API                          │ HTTPS
          │                                   │
┌─────────┼───────────────────────────────────┼──────────────────┐
│         │      APPLICATION LAYER            │                  │
├─────────┼───────────────────────────────────┼──────────────────┤
│         ▼                                   ▼                  │
│  ┌─────────────┐                  ┌──────────────────┐        │
│  │    WAHA     │                  │   Next.js App    │        │
│  │  HTTP API   │                  │  (Frontend/API)  │        │
│  └─────┬───────┘                  └────────┬─────────┘        │
│        │                                   │                  │
│        │ Webhook                           │ Internal API     │
│        │                                   │                  │
│        ▼                                   ▼                  │
│  ┌─────────────────────────────────────────────────┐         │
│  │           n8n Workflow Engine                   │         │
│  ├─────────────────────────────────────────────────┤         │
│  │  • WAHA Trigger (Webhook Receiver)              │         │
│  │  • User Verification Flow                       │         │
│  │  • OTP Generation & Verification                │         │
│  │  • Document Upload from WhatsApp                │         │
│  │  • OCR Processing for Images                    │         │
│  │  • Vector Embedding Generation                  │         │
│  │  • RAG Chat Flow with AI Agent                  │         │
│  │  • Memory Management (Chat History)             │         │
│  └────────┬────────────────┬───────────────┬───────┘         │
│           │                │               │                  │
└───────────┼────────────────┼───────────────┼──────────────────┘
            │                │               │
            │                │               │
┌───────────┼────────────────┼───────────────┼──────────────────┐
│           │   SERVICE/INTEGRATION LAYER    │                  │
├───────────┼────────────────┼───────────────┼──────────────────┤
│           ▼                ▼               ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Supabase   │  │  Cloudinary  │  │   OpenAI     │       │
│  │  (Database)  │  │ (File Store) │  │     API      │       │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤       │
│  │ • PostgreSQL │  │ • CDN        │  │ • GPT-4-mini │       │
│  │ • pgvector   │  │ • Transform  │  │ • Embeddings │       │
│  │ • Auth       │  │ • Security   │  │ • Vision API │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 3.2 Komponen Utama

#### 3.2.1 Frontend Layer (Next.js)

**Teknologi:** Next.js 15.5.4 dengan App Router

**Tanggung Jawab:**
- Admin dashboard untuk manajemen dokumen
- User authentication UI (login, register)
- Document upload interface dengan drag & drop
- Real-time status monitoring
- Persona customization
- User profile management

**Karakteristik:**
- Server-side rendering (SSR) untuk performance
- Client-side state management dengan React hooks
- Protected routes dengan auth guard
- Responsive design untuk mobile dan desktop

#### 3.2.2 Workflow Engine (n8n)

**Teknologi:** n8n (workflow automation platform)

**Tanggung Jawab:**
- WhatsApp message handling via WAHA webhook
- User verification dan registration flow
- OTP generation dan delivery
- Document processing pipeline
- Image OCR dengan OpenAI Vision
- Vector embedding generation
- RAG-based chat responses
- Memory management (chat history)

**Karakteristik:**
- Visual workflow editor
- Node-based architecture
- Event-driven processing
- Built-in error handling dan retry logic

#### 3.2.3 Database Layer (Supabase)

**Teknologi:** Supabase (PostgreSQL + pgvector)

**Tanggung Jawab:**
- User data storage (`users` table)
- Authentication token management (`auth_tokens`)
- OTP codes untuk verification (`otp_codes`)
- Document metadata (`documents_details`)
- Vector embeddings storage (`documents`)
- Custom AI personas (`cameo_personas`)
- Chat history (`n8n_chat_histories`)

**Karakteristik:**
- ACID compliance untuk data integrity
- pgvector extension untuk similarity search
- Row-level security (RLS) policies
- Real-time subscriptions capability

#### 3.2.4 File Storage (Cloudinary)

**Teknologi:** Cloudinary CDN

**Tanggung Jawab:**
- Upload dan storage dokumen user
- Image optimization dan transformation
- Secure URL generation
- CDN delivery untuk performance

**Karakteristik:**
- Global CDN untuk fast delivery
- Automatic format detection
- Access control dengan signed URLs
- Organized storage per user folder

#### 3.2.5 AI Services (OpenAI)

**Teknologi:** OpenAI API

**Tanggung Jawab:**
- Text embedding generation (text-embedding-3-small)
- Chat completion (GPT-4-mini)
- Image OCR (GPT-4o-mini with Vision)

**Karakteristik:**
- State-of-the-art language models
- Reliable dan scalable
- Multi-language support
- Cost-effective pricing

#### 3.2.6 WhatsApp Integration (WAHA)

**Teknologi:** WAHA (WhatsApp HTTP API)

**Tanggung Jawab:**
- Receive messages dari WhatsApp
- Send text messages
- Handle media files (upload/download)
- Message reactions
- Typing indicators
- Session management

**Karakteristik:**
- Webhook-based architecture
- Multi-session support
- Reliable message delivery
- Media handling

### 3.3 Data Flow

#### 3.3.1 Document Upload Flow (Web)

```
1. User uploads file di web dashboard
   ↓
2. Next.js API route receives file
   ↓
3. File validation (size, type)
   ↓
4. Upload to Cloudinary
   ↓
5. Save metadata to documents_details (status: uploaded)
   ↓
6. Trigger async processing endpoint
   ↓
7. Return success response to user
   ↓
8. Processing endpoint downloads file from Cloudinary
   ↓
9. Detect file type (image vs document)
   ↓
10. If image: OCR with OpenAI Vision
    If document: Extract text with libraries
   ↓
11. Split text into chunks (1000 chars, 200 overlap)
   ↓
12. Generate embeddings for all chunks (batch)
   ↓
13. Store chunks + embeddings in documents table
   ↓
14. Update status to 'processed'
```

#### 3.3.2 Document Upload Flow (WhatsApp)

```
1. User sends document via WhatsApp
   ↓
2. WAHA receives message → trigger webhook
   ↓
3. n8n WAHA Trigger node receives payload
   ↓
4. Check if message has media
   ↓
5. Send "seen" reaction
   ↓
6. Send "processing" reaction (🔃)
   ↓
7. Download media from WAHA URL
   ↓
8. Upload to Cloudinary (organized by user folder)
   ↓
9. Save metadata to documents_details
   ↓
10. Detect if image (PNG/JPG)
   ↓
11. If image: Download → OCR with Tesseract → Convert to text file
    If document: Pass through
   ↓
12. Add metadata (whatsapp_number, document_id, file_name)
   ↓
13. Generate embeddings with OpenAI
   ↓
14. Store in Supabase Vector Store
   ↓
15. Send success reaction (✅)
   ↓
16. Send confirmation message to user
```

#### 3.3.3 RAG Chat Flow

```
1. User sends question via WhatsApp
   ↓
2. WAHA → Webhook → n8n WAHA Trigger
   ↓
3. Send "seen" indicator
   ↓
4. Send "typing" indicator
   ↓
5. Get user data from database
   ↓
6. Get user's custom persona (if exists)
   ↓
7. Query Supabase Vector Store
   - Generate embedding for question
   - Similarity search dengan filter whatsapp_number
   - Retrieve top-k relevant chunks
   ↓
8. AI Agent Node processes:
   Priority 1: Check Vector Database results
   Priority 2: Check Memory Agent (chat history)
   Priority 3: Use general knowledge
   ↓
9. Generate response with OpenAI Chat Model
   - System prompt: dari cameo persona atau default
   - Context: dari vector search results
   - History: last 10 messages
   ↓
10. Stop typing indicator
   ↓
11. Send response to user via WAHA
   ↓
12. Save conversation to n8n_chat_histories
```

### 3.4 Multi-tenancy Implementation

#### 3.4.1 Tenant Isolation Strategy

MINDSYNC menggunakan **whatsapp_number** sebagai tenant identifier untuk isolasi data:

**Database Level:**
```sql
-- Setiap query vector search include filter
SELECT * FROM documents 
WHERE metadata->>'whatsapp_number' = '6281234567890'
ORDER BY embedding <-> query_embedding
LIMIT 5;
```

**Application Level:**
- Session-based memory di n8n menggunakan whatsapp_number sebagai session_id
- Cloudinary files organized dalam folder per user: `mindsync/{whatsapp_number}/`
- Auth tokens linked ke whatsapp_number

**Benefits:**
- Complete data isolation per user
- No risk of data leakage
- Easy to implement dan maintain
- Scalable untuk ribuan users

#### 3.4.2 Security Considerations

**1. Authentication:**
- JWT tokens dengan 7-day expiration
- Token hash stored in database (SHA-256)
- Cookie-based session management
- Secure HttpOnly cookies

**2. Authorization:**
- Row-level filtering pada vector search
- User hanya bisa akses dokumen sendiri
- API routes protected dengan auth middleware

**3. Data Privacy:**
- User documents stored privately di Cloudinary
- Vector embeddings include metadata filter
- Chat history isolated per session

### 3.5 Scalability Design

#### 3.5.1 Horizontal Scaling

**Next.js Application:**
- Stateless design memungkinkan multiple instances
- Load balancer untuk distribute traffic
- CDN untuk static assets

**n8n Workflows:**
- Queue-based processing untuk document processing
- Worker nodes untuk parallel execution
- Webhook scaling dengan multiple endpoints

**Database:**
- Supabase managed PostgreSQL dengan auto-scaling
- Read replicas untuk query load
- pgvector index untuk fast similarity search

#### 3.5.2 Performance Optimization

**Caching Strategy:**
- Vector embeddings cached setelah generation
- User persona data cached
- Frequently accessed documents

**Async Processing:**
- Document processing tidak blocking upload
- Background jobs untuk embedding generation
- Webhook-based communication untuk decoupling

**Batch Operations:**
- Batch embedding generation untuk multiple chunks
- Bulk insert ke database
- Parallel file processing

---

## 4. TECHNOLOGY STACK

### 4.1 Frontend Technologies

#### 4.1.1 Next.js 15.5.4

**Alasan Pemilihan:**
- **App Router**: File-system based routing yang intuitif
- **Server Components**: Reduce JavaScript sent to client
- **API Routes**: Built-in backend API tanpa setup terpisah
- **Image Optimization**: Automatic image optimization
- **SEO**: Built-in SEO support dengan metadata API

**Implementation:**
```javascript
// App Router structure
src/app/
├── (admin)/          // Grouped routes dengan layout shared
│   └── dashboard/
│       ├── page.tsx
│       ├── upload/
│       └── documents/
├── auth/
│   ├── login/
│   └── register/
├── api/              // API routes
│   ├── auth/
│   ├── documents/
│   └── persona/
└── layout.tsx        // Root layout
```

#### 4.1.2 React 19.1.0

**Features Used:**
- **Hooks**: useState, useEffect, useCallback untuk state management
- **Context API**: Global state untuk auth dan user data
- **Suspense**: Loading states untuk async operations
- **Error Boundaries**: Graceful error handling

#### 4.1.3 TypeScript 5

**Benefits:**
- Type safety mengurangi runtime errors
- Better IDE support dengan autocomplete
- Self-documenting code dengan interfaces
- Easier refactoring

**Example Types:**
```typescript
// src/types/index.ts
export interface User {
  whatsapp_number: string;
  name?: string;
  email?: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_whatsapp_number: string;
  file_name: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  uploaded_at: string;
  file_url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

#### 4.1.4 Tailwind CSS 4

**Alasan Pemilihan:**
- **Utility-first**: Rapid prototyping
- **Responsive Design**: Built-in breakpoints
- **Dark Mode**: Easy implementation
- **Performance**: Minimal CSS bundle size

**Configuration:**
```javascript
// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { /* custom palette */ },
        secondary: { /* custom palette */ },
      },
    },
  },
};
```

#### 4.1.5 UI Components

**Radix UI:**
- Accessible components out of the box
- Unstyled, fully customizable
- Components: Dialog, Alert, Avatar, Scroll Area, Separator

**Framer Motion:**
- Smooth animations
- Page transitions
- Micro-interactions

**Lucide React:**
- Icon library
- Tree-shakeable
- Consistent design

### 4.2 Backend Technologies

#### 4.2.1 n8n Workflow Automation

**Alasan Pemilihan:**
- **Visual Workflow Editor**: Non-developers dapat understand logic
- **Pre-built Nodes**: Integrasi dengan 300+ services
- **Custom Code**: JavaScript/Python support untuk logic complex
- **Self-hosted**: Full control over data dan privacy

**Key Nodes Used:**
```
1. WAHA Trigger - Webhook receiver untuk WhatsApp messages
2. HTTP Request - Download files, call APIs
3. Supabase - Database operations
4. OpenAI - Chat completion dan embeddings
5. Cloudinary - File upload
6. Tesseract - OCR processing
7. AI Agent - RAG implementation
8. Vector Store - Supabase pgvector integration
9. Memory Node - Chat history management
10. Switch/IF - Conditional logic
```

#### 4.2.2 Supabase

**Components Used:**

**PostgreSQL Database:**
```sql
-- Full ACID compliance
-- Complex queries dengan JOIN
-- Transactions untuk data consistency
```

**pgvector Extension:**
```sql
-- Vector similarity search
CREATE EXTENSION vector;

-- Vector column
ALTER TABLE documents ADD COLUMN embedding vector(1536);

-- Similarity search query
SELECT * FROM documents
WHERE metadata->>'whatsapp_number' = $1
ORDER BY embedding <-> $2
LIMIT 5;
```

**Authentication (not used, custom JWT instead):**
- Lebih flexible dengan custom JWT
- Integration dengan WhatsApp OTP

**Real-time (available for future use):**
- PostgreSQL change data capture
- WebSocket connections
- Live updates capability

#### 4.2.3 OpenAI API

**Models Used:**

**1. GPT-4-mini**
- **Use Case**: Chat completion untuk RAG responses
- **Context Window**: 128K tokens
- **Cost**: $0.15/1M input tokens, $0.60/1M output tokens
- **Benefits**: Balance antara performance dan cost

**2. text-embedding-3-small**
- **Use Case**: Generate embeddings untuk chunks dan queries
- **Dimensions**: 1536
- **Cost**: $0.02/1M tokens
- **Benefits**: Cost-effective, good quality

**3. gpt-4o-mini (Vision)**
- **Use Case**: OCR untuk images (PNG/JPG)
- **Cost**: $0.15/1M input tokens
- **Benefits**: Multi-modal, very accurate

### 4.3 Document Processing Libraries

#### 4.3.1 PDF Processing

**pdf-parse-new:**
```typescript
import pdfParse from 'pdf-parse-new';

async function extractTextFromPDF(buffer: Buffer) {
  const data = await pdfParse(buffer);
  return {
    text: data.text,
    pages: data.numpages,
  };
}
```

**Why pdf-parse-new:**
- Next.js compatible (no Node.js-specific dependencies)
- Fast processing
- Good accuracy untuk text-based PDFs

#### 4.3.2 Word Documents

**mammoth:**
```typescript
import mammoth from 'mammoth';

async function extractTextFromDOCX(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
```

**Features:**
- Extract text dari DOCX
- Preserve basic formatting
- Handle complex documents

#### 4.3.3 Spreadsheets

**xlsx:**
```typescript
import * as XLSX from 'xlsx';

async function extractTextFromExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  let text = '';
  
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    text += XLSX.utils.sheet_to_txt(worksheet);
  });
  
  return text;
}
```

**Supports:**
- XLSX, XLS
- CSV files
- Multiple sheets

#### 4.3.4 OCR

**OpenAI Vision API (primary):**
```typescript
import OpenAI from 'openai';

async function extractTextFromImage(buffer: Buffer) {
  const base64 = buffer.toString('base64');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Extract all text from this image.' },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } }
      ]
    }]
  });
  
  return response.choices[0].message.content;
}
```

**Why OpenAI Vision vs Tesseract:**
- **Accuracy**: 95%+ vs 70-80%
- **Multi-language**: Better support untuk Bahasa Indonesia
- **Handwriting**: Can handle handwritten text
- **Context Understanding**: Understands layout dan structure
- **No Training**: Works out of the box

### 4.4 Storage Solutions

#### 4.4.1 Cloudinary

**Configuration:**
```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

**Features Used:**
- **Upload**: Automatic format detection
- **Storage**: Organized folders per user
- **CDN**: Global delivery network
- **Access Control**: Signed URLs untuk security
- **Transformation**: Image optimization (jika needed)

**File Organization:**
```
mindsync/
├── 6281234567890/
│   ├── document1.pdf
│   ├── image1.png
│   └── spreadsheet1.xlsx
└── 6281234567891/
    ├── document1.docx
    └── image1.jpg
```

### 4.5 Authentication & Security

#### 4.5.1 JWT (jsonwebtoken)

**Token Generation:**
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    whatsapp_number: user.whatsapp_number,
    name: user.name,
    email: user.email,
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

**Token Verification:**
```typescript
const decoded = jwt.verify(token, JWT_SECRET);
```

**Security:**
- SHA-256 hash stored in database
- Token rotation capability
- Expiration handling

#### 4.5.2 Cookies (js-cookie)

**Client-side Cookie Management:**
```typescript
import Cookies from 'js-cookie';

// Set auth token
Cookies.set('auth_token', token, {
  expires: 7,
  secure: true,
  sameSite: 'strict'
});

// Get token
const token = Cookies.get('auth_token');
```

### 4.6 LangChain Integration

#### 4.6.1 @langchain/openai

**Embeddings Generation:**
```typescript
import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-3-small',
});

const vectors = await embeddings.embedDocuments([
  'chunk 1 text',
  'chunk 2 text',
]);
```

**Benefits:**
- Consistent API untuk different models
- Batch processing support
- Error handling built-in

### 4.7 Development Tools

#### 4.7.1 Package Manager

**npm:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  }
}
```

#### 4.7.2 Linting

**ESLint 9:**
- Code quality enforcement
- Next.js specific rules
- TypeScript support

### 4.8 Dependencies Summary

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@langchain/openai": "^0.6.16",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@supabase/supabase-js": "^2.75.0",
    "class-variance-authority": "^0.7.1",
    "cloudinary": "^2.8.0",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.24",
    "js-cookie": "^3.0.5",
    "jsonwebtoken": "^9.0.2",
    "langchain": "^0.3.36",
    "lucide-react": "^0.545.0",
    "mammoth": "^1.11.0",
    "next": "15.5.4",
    "node-fetch": "^2.7.0",
    "openai": "^6.3.0",
    "pdf-parse-new": "^1.4.1",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.65.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "xlsx": "^0.18.5",
    "zod": "^4.1.12"
  }
}
```

### 4.9 Technology Selection Rationale

| Technology | Alternative Considered | Why Chosen |
|------------|----------------------|------------|
| Next.js | Create React App, Vite | SSR, API routes, production-ready |
| Supabase | Firebase, MongoDB | PostgreSQL, pgvector, open-source |
| n8n | Zapier, Make | Self-hosted, visual editor, flexible |
| Cloudinary | AWS S3, Supabase Storage | CDN, transformations, easy setup |
| OpenAI | Cohere, Anthropic | Best quality, vision API, ecosystem |
| WAHA | Twilio, wa-automate | Open-source, reliable, affordable |
| TypeScript | JavaScript | Type safety, better DX, maintainability |
| Tailwind CSS | Bootstrap, Material-UI | Utility-first, customizable, modern |

---



## 5. DESAIN DATABASE

### 5.1 Overview Database

MINDSYNC menggunakan PostgreSQL database yang di-host oleh Supabase, dengan ekstensi pgvector untuk mendukung vector similarity search. Database dirancang dengan prinsip normalisasi dan optimized untuk multi-tenancy.

### 5.2 Database Schema

#### 5.2.1 Tabel `users`

Tabel utama untuk menyimpan data pengguna yang terdaftar.

```sql
CREATE TABLE public.users (
  whatsapp_number VARCHAR NOT NULL,
  name VARCHAR,
  email VARCHAR UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT users_pkey PRIMARY KEY (whatsapp_number)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Columns:**
- `whatsapp_number` (PK): WhatsApp number dengan format internasional (e.g., "6281234567890")
- `name`: Nama lengkap user (optional)
- `email`: Email address untuk recovery dan notifications (optional, unique)
- `created_at`: Timestamp registrasi

**Design Decisions:**
- WhatsApp number sebagai primary key karena unik dan immutable
- Email optional untuk flexibility
- No password field karena authentication via OTP

#### 5.2.2 Tabel `auth_tokens`

Menyimpan JWT tokens untuk session management.

```sql
CREATE TABLE public.auth_tokens (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_whatsapp_number VARCHAR NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT auth_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT auth_tokens_user_whatsapp_number_fkey 
    FOREIGN KEY (user_whatsapp_number) 
    REFERENCES public.users(whatsapp_number) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_auth_tokens_user ON auth_tokens(user_whatsapp_number);
CREATE INDEX idx_auth_tokens_hash ON auth_tokens(token_hash);
CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at);
```

**Columns:**
- `id` (PK): Unique identifier untuk setiap token
- `user_whatsapp_number` (FK): Link ke users table
- `token_hash`: SHA-256 hash dari JWT token (untuk security)
- `expires_at`: Expiration timestamp (default 7 days)
- `created_at`: Token generation timestamp

**Security Features:**
- Token disimpan sebagai hash, bukan plaintext
- Automatic cascade delete ketika user dihapus
- Index pada expiry untuk efficient cleanup

#### 5.2.3 Tabel `otp_codes`

Temporary storage untuk OTP codes yang dikirim via WhatsApp.

```sql
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_whatsapp_number VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT otp_codes_pkey PRIMARY KEY (id),
  CONSTRAINT otp_codes_user_whatsapp_number_fkey 
    FOREIGN KEY (user_whatsapp_number) 
    REFERENCES public.users(whatsapp_number) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_otp_codes_user ON otp_codes(user_whatsapp_number);
CREATE INDEX idx_otp_codes_code ON otp_codes(code);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);
```

**Columns:**
- `id` (PK): Unique identifier
- `user_whatsapp_number` (FK): WhatsApp number yang request OTP
- `code`: 6-digit numeric code
- `expires_at`: OTP expiry (default 1 hour)
- `created_at`: Generation timestamp

**Flow:**
1. User request OTP via WhatsApp ("SEND OTP")
2. n8n generate 6-digit code
3. Store in database dengan 1-hour expiry
4. Send code via WhatsApp
5. User submit code dalam login form
6. Verify code dari database
7. If valid: delete OTP, create auth token

#### 5.2.4 Tabel `documents_details`

Metadata untuk setiap dokumen yang di-upload user.

```sql
-- Custom enum untuk status
CREATE TYPE processing_status AS ENUM (
  'uploaded', 
  'processing', 
  'completed', 
  'error'
);

CREATE TABLE public.documents_details (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_whatsapp_number VARCHAR NOT NULL,
  file_name TEXT NOT NULL,
  status processing_status NOT NULL DEFAULT 'uploaded',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  file_url TEXT,
  CONSTRAINT documents_details_pkey PRIMARY KEY (id),
  CONSTRAINT documents_user_whatsapp_number_fkey 
    FOREIGN KEY (user_whatsapp_number) 
    REFERENCES public.users(whatsapp_number) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_documents_details_user ON documents_details(user_whatsapp_number);
CREATE INDEX idx_documents_details_status ON documents_details(status);
CREATE INDEX idx_documents_details_uploaded_at ON documents_details(uploaded_at DESC);
```

**Columns:**
- `id` (PK): Unique document identifier
- `user_whatsapp_number` (FK): Document owner
- `file_name`: Original filename
- `status`: Processing status enum
- `uploaded_at`: Upload timestamp
- `file_url`: Cloudinary secure URL

**Status Flow:**
```
uploaded → processing → completed
                     ↓
                   error
```

#### 5.2.5 Tabel `documents` (Vector Store)

Core table untuk vector embeddings dan semantic search.

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE SEQUENCE documents_id_seq;

CREATE TABLE public.documents (
  id BIGINT NOT NULL DEFAULT nextval('documents_id_seq'),
  content TEXT,
  metadata JSONB,
  embedding VECTOR(1536),  -- OpenAI text-embedding-3-small dimensions
  CONSTRAINT documents_pkey PRIMARY KEY (id)
);

-- Indexes untuk performance
CREATE INDEX idx_documents_embedding ON documents 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);
  
CREATE INDEX idx_documents_metadata_whatsapp ON documents 
  USING gin ((metadata->'whatsapp_number'));
  
CREATE INDEX idx_documents_metadata_document_id ON documents 
  ((metadata->>'document_id'));
```

**Columns:**
- `id` (PK): Auto-increment identifier
- `content`: Chunk text content
- `metadata`: JSONB dengan informasi contextual
- `embedding`: 1536-dimensional vector dari OpenAI

**Metadata Structure:**
```json
{
  "whatsapp_number": "6281234567890",
  "file_name": "document.pdf",
  "document_id": "uuid-of-document-details",
  "chunk_index": 0,
  "start_char": 0,
  "end_char": 1000,
  "word_count": 150,
  "total_chunks": 10,
  "page_count": 5,
  "total_word_count": 1500,
  "total_char_count": 10000
}
```

**Similarity Search Query:**
```sql
-- Get top 5 similar chunks untuk specific user
SELECT 
  id,
  content,
  metadata,
  1 - (embedding <=> $1) as similarity
FROM documents
WHERE metadata->>'whatsapp_number' = $2
ORDER BY embedding <=> $1
LIMIT 5;
```

**Index Types:**
- `ivfflat`: Approximate Nearest Neighbor (ANN) index untuk fast similarity search
- `gin`: Inverted index untuk JSONB queries
- Trade-off: Speed vs accuracy (ANN faster tapi approximate)

#### 5.2.6 Tabel `cameo_personas`

Custom AI personalities per user.

```sql
CREATE TABLE public.cameo_personas (
  user_whatsapp_number VARCHAR NOT NULL,
  cameo_name VARCHAR NOT NULL,
  system_prompt TEXT NOT NULL,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status BOOLEAN,
  CONSTRAINT cameo_personas_pkey PRIMARY KEY (user_whatsapp_number),
  CONSTRAINT cameo_personas_user_whatsapp_number_fkey 
    FOREIGN KEY (user_whatsapp_number) 
    REFERENCES public.users(whatsapp_number) ON DELETE CASCADE
);
```

**Columns:**
- `user_whatsapp_number` (PK, FK): One persona per user
- `cameo_name`: Display name untuk AI (e.g., "Mindy", "Professor Bot")
- `system_prompt`: Custom system prompt untuk OpenAI
- `image_url`: Avatar image (optional)
- `updated_at`: Last modification time
- `status`: Active/inactive flag

#### 5.2.7 Tabel `n8n_chat_histories`

Chat conversation memory untuk n8n workflows.

```sql
CREATE SEQUENCE n8n_chat_histories_id_seq;

CREATE TABLE public.n8n_chat_histories (
  id INTEGER NOT NULL DEFAULT nextval('n8n_chat_histories_id_seq'),
  session_id VARCHAR NOT NULL,
  message JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT n8n_chat_histories_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX idx_n8n_chat_histories_session ON n8n_chat_histories(session_id);
CREATE INDEX idx_n8n_chat_histories_created_at ON n8n_chat_histories(created_at DESC);
```

**Columns:**
- `id` (PK): Auto-increment identifier
- `session_id`: WhatsApp number (used as session identifier)
- `message`: JSONB dengan role dan content
- `created_at`: Message timestamp

**Message Structure:**
```json
{
  "role": "user" | "assistant",
  "content": "message text"
}
```

---

