import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

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

    // Validate file type - documents and images only (no videos)
    const allowedTypes = [
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // Images (for OCR)
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Hanya dokumen (PDF, DOCX, TXT, CSV, XLSX) dan gambar (PNG, JPG) yang diperbolehkan." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Cloudinary
    const cloudinaryFolder = `mindsync/${whatsappNumber}`;
    let uploadResult;
    
    try {
      uploadResult = await uploadFileToCloudinary(
        fileBuffer,
        file.name,
        cloudinaryFolder
      );
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        { error: "Gagal upload file ke Cloudinary" },
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
        file_url: uploadResult.secure_url,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Gagal menyimpan metadata dokumen" },
        { status: 500 }
      );
    }

    // Trigger document processing (async, non-blocking)
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/documents/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: documentData.id,
          fileName: file.name,
          whatsappNumber,
          fileUrl: uploadResult.secure_url,
          mimeType: file.type,
        }),
      }
    ).catch((error) => {
      console.error("Error triggering document processing:", error);
    });

    return NextResponse.json({
      success: true,
      message: "File berhasil diupload! Lagi diproses nih, tunggu sebentar ya 🎉",
      data: {
        id: documentData.id,
        fileName: documentData.file_name,
        status: documentData.status,
        uploadedAt: documentData.uploaded_at,
        fileUrl: uploadResult.secure_url,
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
