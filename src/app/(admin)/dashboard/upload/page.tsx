"use client";

import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/utils/cookies";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileIcon,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "processing" | "processed" | "error";
  progress: number;
  error?: string;
  documentId?: string;
  chunksCount?: number;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const userData = getUserData();

  // Handle drag events
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  // Handle file input change
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  // Add files to the list
  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
    toast.success(`${newFiles.length} file berhasil ditambahkan! 🎉`);
  };

  // Remove file from list
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.info("File dihapus dari daftar");
  };

  // Update file progress
  const updateFileProgress = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
      )
    );
  };

  // Set file status
  const setFileStatus = (
    id: string, 
    status: "pending" | "uploading" | "success" | "processing" | "processed" | "error",
    progress: number,
    error?: string,
    documentId?: string,
    chunksCount?: number
  ) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status, progress, error, documentId, chunksCount } : f))
    );
  };

  // Test Upload - untuk testing webhook
  const testUpload = async () => {
    // Create file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls";
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) {
        toast.error("Tidak ada file yang dipilih");
        return;
      }

      try {
        toast.info("Testing upload ke webhook... 🚀");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("whatsapp_number", userData?.whatsapp_number as string);
        formData.append("file_name", file.name);

        const url = "https://adzi.magang.pro/webhook-test/upload-file";
        // Call upload API
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          toast.success("Test upload berhasil! Cek webhook-mu 🎉");
          console.log("Upload result:", result);
        } else {
          toast.error(`Test upload gagal: ${result.error}`);
          console.error("Upload error:", result);
        }
      } catch (error) {
        console.error("Test upload error:", error);
        toast.error("Terjadi kesalahan saat test upload");
      }
    };

    // Trigger file picker
    input.click();
  };

  // Poll document status
  const pollDocumentStatus = async (fileId: string, documentId: string) => {
    const maxAttempts = 30; // Max 30 attempts (5 minutes)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/documents/status/${documentId}`);
        const result = await response.json();

        if (result.success) {
          const docStatus = result.data.status;

          if (docStatus === "processing") {
            setFileStatus(fileId, "processing", 100);
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, 10000); // Poll every 10 seconds
            } else {
              setFileStatus(fileId, "error", 0, "Timeout - proses terlalu lama");
              toast.error("Proses dokumen timeout. Coba lagi ya 😢");
            }
          } else if (docStatus === "processed") {
            setFileStatus(
              fileId,
              "processed",
              100,
              undefined,
              documentId,
              result.data.chunksCount
            );
            toast.success(`${result.data.fileName} siap digunakan! 🎉`);
          } else if (docStatus === "failed") {
            setFileStatus(fileId, "error", 0, "Gagal proses dokumen");
            toast.error("Gagal proses dokumen 😢");
          }
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    };

    // Start polling after 5 seconds
    setTimeout(poll, 5000);
  };

  // Upload single file
  const uploadFile = async (uploadedFile: UploadedFile) => {
    setFileStatus(uploadedFile.id, "uploading", 0);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("whatsapp_number", userData?.whatsapp_number as string);
      formData.append("file_name", uploadedFile.file.name);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        updateFileProgress(uploadedFile.id);
      }, 200);

      const response = await fetch("https://adzi.magang.pro/webhook-test/upload-file", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || "Upload failed";
        throw new Error(errorMsg);
      }

      if (result.success && result.data.id) {
        setFileStatus(uploadedFile.id, "processing", 100, undefined, result.data.id);
        toast.success(`${uploadedFile.file.name} berhasil diupload! Lagi diproses nih... ⏳`);

        // Start polling untuk status processing
        pollDocumentStatus(uploadedFile.id, result.data.id);
      } else {
        throw new Error(result.error || "Upload response tidak valid");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal upload file";
      setFileStatus(uploadedFile.id, "error", 0, errorMessage);
      toast.error(`Oops! ${errorMessage} 😢`);
    }
  };

  // Upload all pending files
  const uploadAllFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");

    if (pendingFiles.length === 0) {
      toast.info("Nggak ada file yang perlu diupload nih");
      return;
    }

    for (const file of pendingFiles) {
      await uploadFile(file);
    }
  };

  // Clear all uploaded files
  const clearAllFiles = () => {
    setFiles([]);
    toast.info("Semua file dihapus dari daftar");
  };

  // Get file icon based on file type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8" />;
    } else if (file.type.includes("pdf")) {
      return <FileText className="h-8 w-8" />;
    } else {
      return <File className="h-8 w-8" />;
    }
  };

  // Get file status class
  const getFileStatusClass = (status: string) => {
    if (status === "processed") {
      return "bg-green-100 text-green-600 dark:bg-green-950";
    }
    if (status === "success" || status === "processing") {
      return "bg-blue-100 text-blue-600 dark:bg-blue-950";
    }
    if (status === "error") {
      return "bg-red-100 text-red-600 dark:bg-red-950";
    }
    if (status === "uploading") {
      return "bg-blue-100 text-blue-600 dark:bg-blue-950";
    }
    return "bg-slate-100 text-slate-600 dark:bg-slate-900";
  };

  // Get status label
  const getStatusLabel = (status: string, chunksCount?: number) => {
    switch (status) {
      case "pending":
        return "Siap upload";
      case "uploading":
        return "Uploading...";
      case "success":
        return "Upload selesai";
      case "processing":
        return "Lagi diproses... ⏳";
      case "processed":
        return `Siap! (${chunksCount || 0} chunks) ✨`;
      case "error":
        return "Gagal";
      default:
        return status;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Upload Dokumen 📄</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Yuk, upload dokumen kamu buat nambah knowledge base! Gampang kok 😊
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={testUpload}
          className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950"
        >
          🧪 Test Upload Webhook
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Drag & drop file kamu di sini, atau klik buat pilih file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-slate-300 hover:border-blue-400 dark:border-slate-700"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls"
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-blue-100 p-6 dark:bg-blue-950">
                <Upload className="h-12 w-12 text-blue-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {isDragging
                    ? "Lepas file kamu di sini! 🎯"
                    : "Drop file kamu di sini"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  atau
                </p>
              </div>

              <label htmlFor="file-upload">
                <Button type="button" asChild>
                  <span className="cursor-pointer">
                    <FileIcon className="mr-2 h-4 w-4" />
                    Pilih File
                  </span>
                </Button>
              </label>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Support: PDF, DOC, DOCX, TXT, MD, CSV, XLSX
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar File ({files.length})</CardTitle>
                <CardDescription>
                  {pendingCount > 0 && `${pendingCount} file siap diupload`}
                  {successCount > 0 && ` • ${successCount} berhasil`}
                  {errorCount > 0 && ` • ${errorCount} gagal`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {pendingCount > 0 && (
                  <Button onClick={uploadAllFiles}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Semua
                  </Button>
                )}
                <Button variant="outline" onClick={clearAllFiles}>
                  <X className="mr-2 h-4 w-4" />
                  Hapus Semua
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  {/* File Icon */}
                  <div
                    className={`rounded-lg p-2 ${getFileStatusClass(uploadedFile.status)}`}
                  >
                    {getFileIcon(uploadedFile.file)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {formatFileSize(uploadedFile.file.size)} • {getStatusLabel(uploadedFile.status, uploadedFile.chunksCount)}
                        </p>
                      </div>

                      {/* Status Icon */}
                      <div>
                        {uploadedFile.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => uploadFile(uploadedFile)}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                        {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        )}
                        {uploadedFile.status === "processed" && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        {uploadedFile.status === "error" && (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            uploadedFile.status === "processing"
                              ? "bg-blue-600 animate-pulse"
                              : "bg-blue-600"
                          }`}
                          style={{ width: uploadedFile.status === "processing" ? "100%" : `${uploadedFile.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadedFile.status === "error" && (
                      <p className="text-xs text-red-600">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(uploadedFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              💡 Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              File yang kamu upload bakal diproses sama AI buat bikin knowledge
              base yang bisa kamu akses via WhatsApp!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              ⚡ Format File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Support berbagai format: PDF, Word, Excel, Text, Markdown, dan
              masih banyak lagi!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              🔒 Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              File kamu aman kok! Cuma kamu yang bisa akses dokumen yang kamu
              upload.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

