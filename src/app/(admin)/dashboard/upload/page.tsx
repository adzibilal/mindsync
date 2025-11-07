"use client";

import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/utils/cookies";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, File as FileIcon } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface UploadedFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const userData = getUserData();

  // Handle drag events
  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
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

  // Upload single file
  const uploadFile = async (uploadedFile: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    try {
      const accessToken = Cookies.get("mindsync_auth_token");

      if (!accessToken) {
        throw new Error("Access token tidak ditemukan");
      }

      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("whatsapp_number", userData?.whatsapp_number as string);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload gagal: ${response.statusText}`);
      }

      await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "success", progress: 100 }
            : f
        )
      );

      toast.success(`${uploadedFile.file.name} berhasil diupload! ✨`);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal upload file";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "error", progress: 0, error: errorMessage }
            : f
        )
      );
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

  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    toast.info("Semua file dihapus dari daftar");
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30";
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30";
      case "uploading":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30";
      default:
        return "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30";
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Dokumen 📄</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Yuk, upload dokumen kamu buat nambah knowledge base! 😊
        </p>
      </div>

      {/* Drag & Drop Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Drag & drop file kamu di sini, atau klik buat pilih file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <button
            type="button"
            className={`relative w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-slate-300 hover:border-blue-400 dark:border-slate-700"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
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

              <label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" asChild>
                  <span>
                    <FileIcon className="mr-2 h-4 w-4 inline" />
                    Pilih File
                  </span>
                </Button>
              </label>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Daftar File ({files.length})</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {pendingCount > 0 && `${pendingCount} siap • `}
                {uploadingCount > 0 && `${uploadingCount} uploading • `}
                {successCount > 0 && `${successCount} berhasil • `}
                {errorCount > 0 && `${errorCount} gagal`}
              </p>
            </div>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <Button onClick={uploadAllFiles} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Semua
                </Button>
              )}
              {files.length > 0 && (
                <Button variant="outline" onClick={clearAllFiles} className="gap-2">
                  <X className="h-4 w-4" />
                  Hapus Semua
                </Button>
              )}
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className={`rounded-lg border-2 p-4 transition-all ${getStatusColor(
                  uploadedFile.status
                )}`}
              >
                {/* File Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="ml-2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium">
                    {uploadedFile.status === "pending" && "Siap upload"}
                    {uploadedFile.status === "uploading" && "Uploading..."}
                    {uploadedFile.status === "success" && "Berhasil! ✨"}
                    {uploadedFile.status === "error" && "Gagal"}
                  </span>
                  <div>
                    {(uploadedFile.status === "uploading") && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                    {uploadedFile.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {uploadedFile.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {uploadedFile.status === "uploading" && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700 mb-3">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadedFile.progress}%` }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {uploadedFile.status === "error" && uploadedFile.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                    {uploadedFile.error}
                  </p>
                )}

                {/* Action Button */}
                {uploadedFile.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => uploadFile(uploadedFile)}
                    className="w-full gap-2"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                )}

                {uploadedFile.status === "error" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => uploadFile(uploadedFile)}
                    className="w-full gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Coba Lagi
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            Belum ada file. Drag & drop atau pilih file untuk memulai! 📁
          </p>
        </div>
      )}
    </div>
  );
}
