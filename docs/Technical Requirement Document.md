Dokumen Kebutuhan Teknis (Technical Requirement Document) - Mindsync v1.0
1. Tinjauan Sistem (System Overview)
Mindsync adalah platform manajemen pengetahuan personal berbasis obrolan yang memungkinkan pengguna untuk menyimpan, mengelola, dan mengambil informasi dari dokumen mereka melalui antarmuka percakapan. Sistem ini terdiri dari sebuah Web Admin Dashboard untuk manajemen dokumen dan sebuah Chatbot yang diakses melalui WAHA sebagai antarmuka utama. Arsitektur sistem dirancang untuk menjadi multi-tenant, memastikan data setiap pengguna terisolasi dan aman.
2. Tumpukan Teknologi (Technology Stack)
Frontend (Web Admin): Next.js
Backend & Otomatisasi Alur Kerja (Workflow Automation): n8n
Database: Supabase (termasuk Supabase Vector untuk penyimpanan embedding)
Large Language Model (LLM): OpenAI API
Antarmuka Chat: WAHA
3. Persyaratan Fungsional (Functional Requirements)
3.1. Modul Onboarding & Manajemen Pengguna
REQ-001: Sistem harus dapat menerima pesan masuk dari nomor WhatsApp pengguna melalui webhook WAHA.
REQ-002: Jika nomor pengirim belum ada di database pengguna, sistem (via n8n workflow) harus merespon dengan pesan sambutan standar.
REQ-003: Pesan sambutan harus berisi sebuah URL unik yang mengarahkan pengguna ke halaman pendaftaran di Web Admin.
REQ-004: Web Admin harus menyediakan formulir pendaftaran (misal: Nama, Email, Nomor WhatsApp).
REQ-005: Saat pendaftaran berhasil, data pengguna (termasuk nomor WhatsApp sebagai ID unik) harus disimpan dalam tabel users di database Supabase.
3.2. Modul Web Admin Dashboard (Next.js)
REQ-006: Pengguna yang sudah terdaftar harus bisa login ke Web Admin.
REQ-007: Setelah login, pengguna harus melihat dashboard pribadi untuk mengelola knowledge base mereka.
REQ-008: Dashboard harus menyediakan fungsionalitas untuk mengunggah dokumen.
REQ-009: Dashboard harus menampilkan daftar semua dokumen yang telah diunggah oleh pengguna.
REQ-010: Pengguna harus dapat menghapus dokumen dari knowledge base mereka.
3.3. Modul Pemrosesan Dokumen & Knowledge Base (n8n & Supabase Vector)
REQ-011: Setiap dokumen yang diunggah harus diproses oleh alur kerja di n8n.
REQ-012: Alur kerja pemrosesan harus mengekstrak teks, membaginya (chunking), membuat vector embeddings (via OpenAI), dan menyimpannya ke Supabase Vector.
REQ-013 (Kebutuhan Kritis - Multi-tenancy): Setiap embedding yang disimpan di Supabase Vector HARUS memiliki metadata yang mengidentifikasi pemiliknya (misal: user_whatsapp_number).
REQ-014: Sistem harus memungkinkan pengguna untuk mengunggah dokumen langsung melalui chat di WAHA. Alur kerja di n8n harus dapat menangani file attachments dari webhook WAHA.
3.4. Modul Interaksi Chat (WAHA, n8n, OpenAI)
REQ-015: Sistem harus dapat menerima pesan teks dari pengguna yang sudah terdaftar melalui WAHA.
REQ-016: Saat menerima kueri (pertanyaan), alur kerja di n8n harus melakukan proses Retrieval-Augmented Generation (RAG):
Retrieval: Membuat embedding dari kueri, lalu melakukan similarity search pada Supabase Vector dengan filter berdasarkan user_whatsapp_number pengirim.
Augmentation: Menggabungkan kueri asli dengan konteks yang relevan.
Generation: Mengirimkan prompt yang sudah diperkaya ke OpenAI API untuk menghasilkan jawaban.
REQ-017: Jawaban yang dihasilkan oleh LLM harus dikirim kembali sebagai balasan kepada pengguna melalui API WAHA.
4. Persyaratan Non-Fungsional (Non-Functional Requirements)
REQ-NFR-001 (Keamanan): Data antar pengguna harus terisolasi sepenuhnya.
REQ-NFR-002 (Kinerja): Waktu respons dari kueri hingga jawaban idealnya tidak lebih dari 10 detik.
REQ-NFR-003 (Skalabilitas): Arsitektur harus mampu menangani penambahan pengguna baru.
5. Fitur Tambahan (Opsional - Jika Waktu Memungkinkan)
REQ-OPT-001 (Dukungan Grup): Sistem harus bisa ditambahkan ke dalam grup WhatsApp melalui WAHA dan merespon sesuai konteks pengguna atau grup.

