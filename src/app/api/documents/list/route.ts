import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const whatsappNumber = searchParams.get("whatsapp_number");

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number tidak ditemukan" },
        { status: 400 }
      );
    }

    // Get documents from documents_details table
    const { data: documents, error: docError } = await supabase
      .from("documents_details")
      .select("*")
      .eq("user_whatsapp_number", whatsappNumber)
      .order("uploaded_at", { ascending: false });

    if (docError) {
      console.error("Documents error:", docError);
      return NextResponse.json(
        { error: "Gagal mengambil daftar dokumen" },
        { status: 500 }
      );
    }

    // Get chunks count for each document
    const documentsWithChunks = await Promise.all(
      (documents || []).map(async (doc) => {
        const { count } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("metadata->>document_id", doc.id);

        return {
          ...doc,
          chunksCount: count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: documentsWithChunks,
    });
  } catch (error) {
    console.error("List documents error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar dokumen" },
      { status: 500 }
    );
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get("id");
    const whatsappNumber = searchParams.get("whatsapp_number");

    if (!documentId || !whatsappNumber) {
      return NextResponse.json(
        { error: "Document ID dan WhatsApp number diperlukan" },
        { status: 400 }
      );
    }

    // Get document details
    const { data: document, error: fetchError } = await supabase
      .from("documents_details")
      .select("*")
      .eq("id", documentId)
      .eq("user_whatsapp_number", whatsappNumber)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete from storage
    const storagePath = `${whatsappNumber}/${document.file_name}`;
    const { error: storageError } = await supabase.storage
      .from("mindsync_storage")
      .remove([storagePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Continue even if storage delete fails
    }

    // Delete chunks from documents table
    const { error: chunksError } = await supabase
      .from("documents")
      .delete()
      .eq("metadata->>document_id", documentId);

    if (chunksError) {
      console.error("Chunks delete error:", chunksError);
    }

    // Delete from documents_details
    const { error: deleteError } = await supabase
      .from("documents_details")
      .delete()
      .eq("id", documentId)
      .eq("user_whatsapp_number", whatsappNumber);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { error: "Gagal menghapus dokumen" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil dihapus! 🗑️",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus dokumen" },
      { status: 500 }
    );
  }
}

