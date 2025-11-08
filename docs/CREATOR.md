# MINDSYNC - Dokumentasi Proyek Skripsi

---

## 👨‍💻 Pembuat Proyek

**Proyek MindSync ini sepenuhnya dikembangkan oleh:**

**Adzi Bilal Maulana H**  
NIM: 22552011164  
Program Studi: Teknik Informatika

---

## 📚 Informasi Proyek

**MindSync** adalah proyek skripsi yang dirancang, dikembangkan, dan diimplementasikan oleh **Adzi Bilal Maulana H** sebagai karya tugas akhir. Proyek ini mengimplementasikan arsitektur Retrieval-Augmented Generation (RAG) pada sistem manajemen dokumen berbasis obrolan untuk optimalisasi pencarian informasi.

### Pernyataan Kepemilikan

Seluruh aspek proyek ini, termasuk namun tidak terbatas pada:
- 🏗️ Desain arsitektur sistem
- 💻 Pengembangan kode (frontend dan backend)
- 🤖 Implementasi workflow automation
- 📊 Desain database dan optimisasi
- 🔐 Sistem keamanan dan autentikasi
- 📱 Integrasi WhatsApp dan AI
- 📝 Dokumentasi teknis lengkap

**Adalah hasil karya original dari Adzi Bilal Maulana H** yang dikembangkan dari November 2024 hingga November 2025.

---

## 👨‍🎓 Detail Mahasiswa

**Nama Lengkap:** Adzi Bilal Maulana H  
**NIM:** 22552011164  
**Program Studi:** Teknik Informatika  
**Institusi:** Universitas Teknologi Bandung

**Judul Skripsi:**  
*Implementasi Arsitektur Retrieval-Augmented Generation (RAG) pada Sistem Manajemen Dokumen Berbasis Obrolan untuk Optimalisasi Pencarian Informasi* (MindSync)

**Periode Pengerjaan:** November 2024 - November 2025  
**Tanggal Penyusunan Dokumentasi:** November 2025

---

## 🎯 Deskripsi Proyek

MindSync adalah platform inovatif yang menggabungkan teknologi AI dan WhatsApp untuk menciptakan sistem manajemen dokumen yang intuitif dan efisien. Platform ini memungkinkan pengguna untuk:

- 📄 Upload dokumen dalam berbagai format (PDF, DOCX, TXT, CSV, XLSX, PNG, JPG)
- 💬 Bertanya tentang isi dokumen melalui WhatsApp dengan bahasa alami
- 🤖 Mendapatkan jawaban akurat berbasis AI dengan teknologi RAG
- 🔍 Melakukan pencarian semantik pada knowledge base personal
- ⚡ Mengakses informasi kapan saja, di mana saja melalui platform familiar

---

## 🏗️ Teknologi Utama

### Frontend
- **Next.js 15.5.4** - Modern React framework
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### Backend & Automation
- **n8n** - Workflow automation engine
- **Supabase** - PostgreSQL database dengan pgvector
- **Cloudinary** - File storage dan CDN

### AI & Machine Learning
- **OpenAI GPT-4-mini** - Large Language Model
- **text-embedding-3-small** - Vector embeddings
- **GPT-4o-mini Vision** - OCR untuk gambar

### Integration
- **WAHA** - WhatsApp HTTP API
- **JWT** - Authentication dengan OTP

---

## 🎓 Kontribusi Akademis

Proyek ini memberikan kontribusi dalam beberapa aspek:

1. **Implementasi Praktis RAG**: Demonstrasi nyata penggunaan Retrieval-Augmented Generation untuk document Q&A
2. **Hybrid Architecture**: Kombinasi web application dengan workflow automation untuk fleksibilitas
3. **WhatsApp Integration**: Penelitian integrasi teknologi AI dengan platform messaging populer
4. **Multi-tenancy Design**: Implementasi isolasi data untuk aplikasi SaaS
5. **Vector Search Optimization**: Penggunaan pgvector untuk similarity search yang efisien

---

## 📊 Pencapaian

- ✅ Arsitektur multi-tenant yang scalable
- ✅ Processing otomatis untuk 7 format file berbeda
- ✅ OCR cerdas menggunakan OpenAI Vision API
- ✅ RAG implementation dengan hierarchical priority system
- ✅ Real-time status tracking untuk document processing
- ✅ Custom AI persona per user
- ✅ Session-based memory untuk context continuity
- ✅ Comprehensive admin dashboard

---

## 📄 Dokumentasi

Dokumentasi lengkap proyek tersedia di:
- **MINDSYNC.md** - Dokumentasi teknis komprehensif untuk skripsi
- **Technical Requirement Document.md** - Spesifikasi kebutuhan sistem
- **UPLOAD_FEATURE_DOCS.md** - Dokumentasi fitur upload dokumen
- **FILE_UPLOAD_IMPLEMENTATION.md** - Detail implementasi upload
- **PENGGUNA.md** - Analisis pengguna dan use cases

---

## 🌟 Visi Proyek

MindSync dikembangkan dengan visi untuk:

1. **Demokratisasi AI**: Membuat teknologi AI dapat diakses melalui platform yang familiar (WhatsApp)
2. **Produktivitas**: Mengurangi waktu yang terbuang untuk pencarian informasi (50% time waste menurut IDC)
3. **Second Brain**: Membangun sistem knowledge base personal yang reliable
4. **User Experience**: Mengubah document management dari task membosankan menjadi percakapan produktif

---

## 📈 Target Market

- **TAM**: 214 juta penduduk Indonesia (18-60 tahun)
- **SAM**: 143 juta pekerja yang bergantung pada dokumentasi
- **SOM**: 87.9 juta pekerja formal di Indonesia

---

## 🔗 Repository Structure

```
mindsync/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Core libraries
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── types/            # TypeScript definitions
├── docs/                 # Dokumentasi proyek
├── public/               # Static assets
└── Mindsync Engine V2.json  # n8n workflow
```

---

## 🎖️ Kontribusi dan Pengembangan

### Developer dan Architect
**Adzi Bilal Maulana H** bertanggung jawab penuh atas:

#### Desain dan Arsitektur
- ✅ Perancangan arsitektur hybrid (Next.js + n8n)
- ✅ Desain database dengan pgvector untuk vector search
- ✅ Strategi multi-tenancy dan data isolation
- ✅ Flow design untuk upload, processing, dan RAG

#### Development
- ✅ Frontend development dengan Next.js 15 dan React 19
- ✅ Backend API development dengan TypeScript
- ✅ n8n workflow automation untuk WhatsApp integration
- ✅ Implementasi RAG dengan OpenAI dan LangChain
- ✅ OCR implementation menggunakan OpenAI Vision API
- ✅ Authentication system dengan JWT dan OTP

#### Integration dan Deployment
- ✅ WhatsApp integration melalui WAHA
- ✅ Cloudinary integration untuk file storage
- ✅ Supabase setup dan database optimization
- ✅ Environment configuration dan security

#### Testing dan Documentation
- ✅ Comprehensive technical documentation
- ✅ System testing dan validation
- ✅ User flow documentation
- ✅ API documentation

---

## 📝 Pernyataan Keaslian

**Saya, Adzi Bilal Maulana H (NIM: 22552011164), dengan ini menyatakan bahwa:**

1. Proyek MindSync ini adalah hasil karya saya sendiri
2. Seluruh kode program ditulis oleh saya secara original
3. Arsitektur dan desain sistem adalah hasil pemikiran dan analisis saya
4. Dokumentasi teknis disusun berdasarkan implementasi yang saya kerjakan
5. Referensi dan library pihak ketiga yang digunakan telah dicantumkan dengan proper attribution
6. Proyek ini dikembangkan sebagai bagian dari persyaratan kelulusan Program Studi Teknik Informatika

**Tanggal:** November 2025  
**Tempat:** [Lokasi]

---

## 📧 Kontak Pembuat

Untuk pertanyaan, informasi lebih lanjut, atau diskusi mengenai proyek MindSync ini, silakan hubungi:

**Adzi Bilal Maulana H**  
NIM: 22552011164  
Program Studi: Teknik Informatika  
Email: [email@example.com]  
GitHub: [github.com/username]

---

## 📜 Hak Cipta dan Lisensi

**© 2025 Adzi Bilal Maulana H**

Proyek MindSync dan seluruh komponennya (kode, dokumentasi, desain) adalah hak cipta **Adzi Bilal Maulana H**.

Proyek ini dikembangkan untuk keperluan akademis sebagai tugas akhir/skripsi. Penggunaan, modifikasi, atau distribusi proyek ini untuk keperluan non-akademis memerlukan izin tertulis dari pembuat.

---

## 🙏 Acknowledgments

Terima kasih kepada:
- Dosen pembimbing yang telah memberikan guidance selama pengerjaan
- Keluarga yang telah mendukung selama proses pengembangan
- Open source community atas tools dan libraries yang digunakan

---

**Dibuat dengan ❤️ oleh Adzi Bilal Maulana H**  
**MindSync Project - 2025**

---

