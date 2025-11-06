import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Document ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // Get document data
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (docError || !document) {
      console.error("Document error:", docError);
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get chunks count if processed
    let chunksCount = 0;
    if (document.status === "processed") {
      const { count } = await supabase
        .from("knowledge_base_chunks")
        .select("*", { count: "exact", head: true })
        .eq("document_id", id);
      
      chunksCount = count || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        fileName: document.file_name,
        status: document.status,
        uploadedAt: document.uploaded_at,
        chunksCount,
        statusMessage: getStatusMessage(document.status),
      },
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Gagal cek status dokumen" },
      { status: 500 }
    );
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "uploaded":
      return "Dokumen berhasil diupload, menunggu diproses...";
    case "processing":
      return "Lagi diproses nih, tunggu sebentar ya! 🔄";
    case "processed":
      return "Dokumen sudah siap! Bisa ditanya lewat WhatsApp 🎉";
    case "failed":
      return "Oops! Ada yang error. Coba upload lagi ya 😢";
    default:
      return "Status tidak diketahui";
  }
}

