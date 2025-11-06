import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractTextFromFile, splitTextIntoChunks } from "@/lib/document-processor";
import { generateEmbeddings } from "@/lib/embeddings";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, fileName, whatsappNumber } = body;

    if (!documentId || !fileName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Parameter tidak lengkap" },
        { status: 400 }
      );
    }

    // Update status jadi processing
    await supabase
      .from("documents")
      .update({ status: "processing" })
      .eq("id", documentId);

    // Download file dari storage
    const storagePath = fileName.includes('/') ? fileName : `${whatsappNumber}/${fileName}`;
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("mindsync_storage")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", documentId);
      
      return NextResponse.json(
        { error: "Gagal download file dari storage" },
        { status: 500 }
      );
    }

    // Convert blob to buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text dari file
    const processed = await extractTextFromFile(
      buffer,
      fileData.type,
      fileName
    );

    if (!processed.text || processed.text.trim().length === 0) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", documentId);
      
      return NextResponse.json(
        { error: "Dokumen kosong atau tidak bisa diproses" },
        { status: 400 }
      );
    }

    // Split text menjadi chunks
    const chunks = splitTextIntoChunks(processed.text, 1000, 200);

    if (chunks.length === 0) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", documentId);
      
      return NextResponse.json(
        { error: "Gagal membagi dokumen menjadi chunks" },
        { status: 500 }
      );
    }

    // Generate embeddings untuk semua chunks (batch processing)
    const chunkTexts = chunks.map((chunk) => chunk.content);
    const embeddings = await generateEmbeddings(chunkTexts);

    // Prepare data untuk insert ke knowledge_base_chunks
    const knowledgeChunks = chunks.map((chunk, index) => ({
      document_id: documentId,
      content: chunk.content,
      embedding: JSON.stringify(embeddings[index]), // Supabase vector type
      user_whatsapp_number: whatsappNumber,
      metadata: {
        file_name: fileName,
        chunk_index: chunk.index,
        start_char: chunk.metadata.startChar,
        end_char: chunk.metadata.endChar,
        word_count: chunk.metadata.wordCount,
        total_chunks: chunks.length,
        document_metadata: {
          page_count: processed.metadata.pageCount,
          total_word_count: processed.metadata.wordCount,
          total_char_count: processed.metadata.charCount,
        },
      },
    }));

    // Insert chunks ke database (batch insert)
    const { error: insertError } = await supabase
      .from("knowledge_base_chunks")
      .insert(knowledgeChunks);

    if (insertError) {
      console.error("Insert error:", insertError);
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", documentId);
      
      return NextResponse.json(
        { error: "Gagal menyimpan chunks ke database" },
        { status: 500 }
      );
    }

    // Update status jadi processed
    await supabase
      .from("documents")
      .update({ status: "processed" })
      .eq("id", documentId);

    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil diproses! 🎉",
      data: {
        documentId,
        chunksCount: chunks.length,
        totalWords: processed.metadata.wordCount,
        totalChars: processed.metadata.charCount,
        pageCount: processed.metadata.pageCount,
      },
    });
  } catch (error) {
    console.error("Processing error:", error);
    
    // Update status jadi failed jika ada document ID
    if (request.body) {
      try {
        const body = await request.json();
        if (body.documentId) {
          await supabase
            .from("documents")
            .update({ status: "failed" })
            .eq("id", body.documentId);
        }
      } catch (e) {
        // Ignore parsing error
        console.error("Error parsing body for cleanup:", e);
      }
    }
    
    return NextResponse.json(
      { 
        error: "Oops! Ada yang error waktu proses dokumen. Coba lagi ya 😢",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

