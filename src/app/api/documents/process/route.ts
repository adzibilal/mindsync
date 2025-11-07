import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractTextFromFile, splitTextIntoChunks } from "@/lib/document-processor";
import { generateEmbeddings } from "@/lib/embeddings";
import { downloadFileFromCloudinary } from "@/lib/cloudinary";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  console.log("=== PROCESS ENDPOINT CALLED ===");
  let documentId: string | undefined;
  
  try {
    const body = await request.json();
    console.log("Request body:", body);
    const params = body as { documentId: string; fileName: string; whatsappNumber: string; fileUrl: string; mimeType: string };
    documentId = params.documentId;
    const { fileName, whatsappNumber, fileUrl, mimeType } = params;

    if (!documentId || !fileName || !whatsappNumber || !fileUrl) {
      console.error("Missing parameters:", { documentId, fileName, whatsappNumber, fileUrl });
      return NextResponse.json(
        { error: "Parameter tidak lengkap" },
        { status: 400 }
      );
    }

    console.log("Processing document:", { documentId, fileName, whatsappNumber });

    // Update status jadi processing
    await supabase
      .from("documents_details")
      .update({ status: "processing" })
      .eq("id", documentId);

    // Download file dari Cloudinary URL
    console.log("Downloading file from Cloudinary:", fileUrl);
    let fileBuffer: Buffer;
    try {
      fileBuffer = await downloadFileFromCloudinary(fileUrl);
      console.log("File downloaded successfully, size:", fileBuffer.length, "bytes");
    } catch (downloadError) {
      console.error("Download error:", downloadError);
      await supabase
        .from("documents_details")
        .update({ status: "error" })
        .eq("id", documentId);

      return NextResponse.json(
        { 
          error: "Gagal download file dari Cloudinary",
          details: downloadError instanceof Error ? downloadError.message : "Unknown error"
        },
        { status: 500 }
      );
    }

    // Extract text dari file (includes OCR for images)
    console.log("Extracting text from file, mimeType:", mimeType);
    let processed;
    try {
      processed = await extractTextFromFile(
        fileBuffer,
        mimeType || "application/octet-stream",
        fileName
      );
      console.log("Text extracted successfully, length:", processed.text.length, "chars");
    } catch (extractError) {
      console.error("Text extraction error:", extractError);
      await supabase
        .from("documents_details")
        .update({ status: "error" })
        .eq("id", documentId);

      return NextResponse.json(
        { 
          error: "Gagal extract text dari dokumen",
          details: extractError instanceof Error ? extractError.message : "Unknown error"
        },
        { status: 500 }
      );
    }

    if (!processed.text || processed.text.trim().length === 0) {
      await supabase
        .from("documents_details")
        .update({ status: "error" })
        .eq("id", documentId);

      return NextResponse.json(
        { error: "Dokumen kosong atau tidak bisa diproses" },
        { status: 400 }
      );
    }

    // Split text menjadi chunks
    console.log("Splitting text into chunks...");
    const chunks = splitTextIntoChunks(processed.text, 1000, 200);
    console.log("Created", chunks.length, "chunks");

    if (chunks.length === 0) {
      await supabase
        .from("documents_details")
        .update({ status: "error" })
        .eq("id", documentId);

      return NextResponse.json(
        { error: "Gagal membagi dokumen menjadi chunks" },
        { status: 500 }
      );
    }

    // Generate embeddings untuk semua chunks (batch processing)
    console.log("Generating embeddings for", chunks.length, "chunks...");
    const chunkTexts = chunks.map((chunk) => chunk.content);
    let embeddings;
    try {
      embeddings = await generateEmbeddings(chunkTexts);
      console.log("Embeddings generated successfully, count:", embeddings.length);
    } catch (embeddingError) {
      console.error("Embedding generation error:", embeddingError);
      await supabase
        .from("documents_details")
        .update({ status: "error" })
        .eq("id", documentId);

      return NextResponse.json(
        { error: "Gagal generate embeddings dari OpenAI" },
        { status: 500 }
      );
    }

    // Prepare data untuk insert ke documents table (vector store)
    // Match n8n flow structure
    const vectorDocuments = chunks.map((chunk, index) => ({
      content: chunk.content,
      metadata: {
        whatsapp_number: whatsappNumber,
        file_name: fileName,
        document_id: documentId,
        chunk_index: chunk.index,
        start_char: chunk.metadata.startChar,
        end_char: chunk.metadata.endChar,
        word_count: chunk.metadata.wordCount,
        total_chunks: chunks.length,
        page_count: processed.metadata.pageCount,
        total_word_count: processed.metadata.wordCount,
        total_char_count: processed.metadata.charCount,
      },
      embedding: embeddings[index], // Supabase vector type expects array directly
    }));

    // Insert chunks ke documents table (vector store)
    console.log("Inserting", vectorDocuments.length, "documents to vector store...");
    console.log("Sample document structure:", JSON.stringify(vectorDocuments[0], null, 2).substring(0, 500));
    const { data: insertData, error: insertError } = await supabase
      .from("documents")
      .insert(vectorDocuments);

    if (insertError) {
      console.error("Insert error:", insertError);
      console.error("Error details:", JSON.stringify(insertError, null, 2));
      await supabase
        .from("documents_details")
        .update({ status: "error" })
        .eq("id", documentId);

      return NextResponse.json(
        { 
          error: "Gagal menyimpan chunks ke vector store",
          details: insertError.message || "Unknown error",
          code: insertError.code
        },
        { status: 500 }
      );
    }
    console.log("Documents inserted successfully!");

    // Update status jadi completed
    console.log("Updating document status to completed...");
    const { data: updateData, error: updateError } = await supabase
      .from("documents_details")
      .update({ status: "completed" })
      .eq("id", documentId)
      .select();

    if (updateError) {
      console.error("Error updating status to completed:", updateError);
      console.error("Update error details:", JSON.stringify(updateError, null, 2));
    } else {
      console.log("Status updated successfully to completed!", updateData);
    }

    console.log("=== PROCESSING COMPLETED SUCCESSFULLY ===");
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
    console.error("=== PROCESSING FAILED ===");
    console.error("Processing error:", error);

    // Update status jadi error jika ada document ID
    if (documentId) {
      try {
        console.log("Updating document status to error...");
        await supabase
          .from("documents_details")
          .update({ status: "error" })
          .eq("id", documentId);
        console.log("Status updated to error successfully");
      } catch (updateError) {
        console.error("Error updating status to error:", updateError);
      }
    } else {
      console.error("No documentId available to update status");
    }

    return NextResponse.json(
      {
        error: "Oops! Ada yang error waktu proses dokumen. Coba lagi ya 😢",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
