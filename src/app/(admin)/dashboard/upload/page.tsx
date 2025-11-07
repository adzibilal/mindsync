"use client";

import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/utils/cookies";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, File as FileIcon } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { GlassCard } from "@/components/ui/glass-card";
import { FloatingIcon } from "@/components/ui/floating-icon";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerBorder } from "@/components/ui/shimmer-border";
import { motion, AnimatePresence } from "framer-motion";

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


  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0} duration={0.5}>
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent"
          >
            Upload Dokumen 📄
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400"
          >
            Yuk, upload dokumen kamu buat nambah knowledge base! 😊
          </motion.p>
        </div>
      </BlurFade>

      {/* Drag & Drop Area */}
      <BlurFade delay={0.2} duration={0.5}>
        <GlassCard>
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Upload File
              </CardTitle>
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
              <ShimmerBorder
                className={`transition-all duration-300 ${
                  isDragging ? "scale-[1.02]" : ""
                }`}
              >
                <button
                  type="button"
                  className={`relative w-full rounded-lg border-2 border-dashed p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-105"
                      : "border-slate-300/50 hover:border-blue-400 dark:border-slate-700/50 backdrop-blur-sm bg-white/30 dark:bg-white/5"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center space-y-4"
                  >
                    <FloatingIcon duration={2.5}>
                      <motion.div 
                        animate={{
                          scale: isDragging ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                        className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg shadow-blue-500/50"
                      >
                        <Upload className="h-12 w-12 text-white" />
                      </motion.div>
                    </FloatingIcon>

                    <div className="space-y-2">
                      <motion.h3 
                        animate={{ scale: isDragging ? 1.05 : 1 }}
                        className="text-lg font-semibold"
                      >
                        {isDragging
                          ? "Lepas file kamu di sini! 🎯"
                          : "Drop file kamu di sini"}
                      </motion.h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        atau
                      </p>
                    </div>

                    <label htmlFor="file-upload" className="cursor-pointer">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button type="button" asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                          <span>
                            <FileIcon className="mr-2 h-4 w-4 inline" />
                            Pilih File
                          </span>
                        </Button>
                      </motion.div>
                    </label>
                  </motion.div>
                </button>
              </ShimmerBorder>
            </CardContent>
          </Card>
        </GlassCard>
      </BlurFade>

      {/* Files Grid */}
      {files.length > 0 && (
        <BlurFade delay={0.4} duration={0.5}>
          <div className="space-y-4">
            <GlassCard>
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Daftar File ({files.length})
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {pendingCount > 0 && `${pendingCount} siap • `}
                        {uploadingCount > 0 && `${uploadingCount} uploading • `}
                        {successCount > 0 && `${successCount} berhasil • `}
                        {errorCount > 0 && `${errorCount} gagal`}
                      </p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2"
                    >
                      {pendingCount > 0 && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={uploadAllFiles} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                            <Upload className="h-4 w-4" />
                            Upload Semua
                          </Button>
                        </motion.div>
                      )}
                      {files.length > 0 && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" onClick={clearAllFiles} className="gap-2 backdrop-blur-sm">
                            <X className="h-4 w-4" />
                            Hapus Semua
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </GlassCard>

          {/* Files Grid */}
          <AnimatePresence mode="popLayout">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((uploadedFile, index) => (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard className={`h-full transition-all duration-200 ${
                    uploadedFile.status === "success" ? "ring-2 ring-green-500/30" :
                    uploadedFile.status === "error" ? "ring-2 ring-red-500/30" :
                    uploadedFile.status === "uploading" ? "ring-2 ring-blue-500/30" : ""
                  }`}>
                    <div className="p-4">
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
                        <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(uploadedFile.id)}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>

                      {/* Status Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium">
                          {uploadedFile.status === "pending" && "Siap upload"}
                          {uploadedFile.status === "uploading" && "Uploading..."}
                          {uploadedFile.status === "success" && "Berhasil! ✨"}
                          {uploadedFile.status === "error" && "Gagal"}
                        </span>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {(uploadedFile.status === "uploading") && (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                              <Loader2 className="h-4 w-4 text-blue-600" />
                            </motion.div>
                          )}
                          {uploadedFile.status === "success" && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                          {uploadedFile.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </motion.div>
                      </div>

                      {/* Progress Bar */}
                      {uploadedFile.status === "uploading" && (
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700 mb-3"
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadedFile.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      )}

                      {/* Error Message */}
                      {uploadedFile.status === "error" && uploadedFile.error && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600 dark:text-red-400 mb-3"
                        >
                          {uploadedFile.error}
                        </motion.p>
                      )}

                      {/* Action Button */}
                      {uploadedFile.status === "pending" && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            size="sm"
                            onClick={() => uploadFile(uploadedFile)}
                            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                          </Button>
                        </motion.div>
                      )}

                      {uploadedFile.status === "error" && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => uploadFile(uploadedFile)}
                            className="w-full gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 backdrop-blur-sm"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Coba Lagi
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </BlurFade>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <BlurFade delay={0.5} duration={0.5}>
          <GlassCard>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="py-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <FloatingIcon duration={3}>
                    <FileIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  </FloatingIcon>
                  <p className="text-slate-600 dark:text-slate-400">
                    Belum ada file. Drag & drop atau pilih file untuk memulai! 📁
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </GlassCard>
        </BlurFade>
      )}
    </div>
  );
}
