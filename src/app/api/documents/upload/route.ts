import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const whatsappNumber = formData.get("whatsapp_number") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File terlalu besar. Maksimal 10MB ya!" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung" },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const storagePath = `${whatsappNumber}/${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("mindsync_storage")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: true, // Allow overwrite if file exists
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Gagal upload file ke storage" },
        { status: 500 }
      );
    }

    // Save document metadata to database (documents_details table)
    const { data: documentData, error: dbError } = await supabase
      .from("documents_details")
      .insert({
        user_whatsapp_number: whatsappNumber,
        file_name: file.name,
        status: "uploaded",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      
      // Rollback: delete uploaded file
      await supabase.storage.from("mindsync_storage").remove([storagePath]);
      
      return NextResponse.json(
        { error: "Gagal menyimpan metadata dokumen" },
        { status: 500 }
      );
    }

    // Hit webhook untuk notifikasi file upload
    try {
      await fetch("https://adzi.magang.pro/webhook-test/file-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: documentData.id,
          whatsapp_number: whatsappNumber,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: storagePath,
          uploaded_at: documentData.uploaded_at,
          status: documentData.status,
        }),
      });
    } catch (webhookError) {
      console.error("Webhook error:", webhookError);
      // Don't fail the upload if webhook fails
    }

    // Trigger document processing (async, non-blocking)
    // Process dilakukan di background agar user tidak perlu menunggu
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/documents/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId: documentData.id,
        fileName: file.name,
        whatsappNumber,
      }),
    }).catch((error) => {
      console.error("Error triggering document processing:", error);
      // Don't throw error, processing akan di-handle terpisah
    });

    return NextResponse.json({
      success: true,
      message: "File berhasil diupload! Lagi diproses nih, tunggu sebentar ya 🎉",
      data: {
        id: documentData.id,
        fileName: documentData.file_name,
        status: documentData.status,
        uploadedAt: documentData.uploaded_at,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Oops! Ada yang error nih. Coba lagi ya" },
      { status: 500 }
    );
  }
}

