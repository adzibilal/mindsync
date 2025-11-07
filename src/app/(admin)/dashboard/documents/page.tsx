"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Trash2,
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload as UploadIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getUserData } from "@/utils/cookies";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

interface Document {
  id: string;
  user_whatsapp_number: string;
  file_name: string;
  status: "uploaded" | "processing" | "completed" | "error";
  uploaded_at: string;
  file_url?: string;
  chunksCount?: number;
}

type StatusFilter = "all" | "uploaded" | "processing" | "completed" | "error";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const userData = getUserData();
  const whatsappNumber = userData?.whatsapp_number as string;

  useEffect(() => {
    if (whatsappNumber) {
      fetchDocuments();
    }
  }, [whatsappNumber]);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, statusFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/documents/list?whatsapp_number=${whatsappNumber}`
      );
      const data = await response.json();

      if (data.success) {
        setDocuments(data.data || []);
      } else {
        toast.error(data.error || "Gagal memuat dokumen");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Terjadi kesalahan saat memuat dokumen");
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((doc) =>
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleDownload = async (doc: Document) => {
    try {
      setDownloadingId(doc.id);
      
      // Check if file_url exists
      if (!doc.file_url) {
        toast.error("URL file tidak ditemukan");
        return;
      }

      // Download directly from Cloudinary URL
      const response = await fetch(doc.file_url);
      
      if (!response.ok) {
        toast.error("Gagal mengunduh file dari Cloudinary");
        return;
      }

      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("File berhasil diunduh! 📥");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Terjadi kesalahan saat mengunduh");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const response = await fetch(
        `/api/documents/list?id=${deleteId}&whatsapp_number=${whatsappNumber}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchDocuments();
      } else {
        toast.error(data.error || "Gagal menghapus dokumen");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan saat menghapus");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
          icon: CheckCircle2,
        };
      case "processing":
        return {
          label: "Processing",
          color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
          icon: Loader2,
        };
      case "uploaded":
        return {
          label: "Uploaded",
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
          icon: Clock,
        };
      case "error":
        return {
          label: "Error",
          color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400",
          icon: FileText,
        };
    }
  };

  const getFileIcon = () => {
    // You can add more specific icons based on file type
    return FileText;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const stats = [
    {
      label: "Total Dokumen",
      value: documents.length,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Completed",
      value: documents.filter((d) => d.status === "completed").length,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      label: "Processing",
      value: documents.filter((d) => d.status === "processing").length,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
    },
    {
      label: "Error",
      value: documents.filter((d) => d.status === "error").length,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Documents
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Kelola semua dokumen kamu di sini
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/dashboard/upload")}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload Dokumen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="h-full transition-shadow hover:shadow-md">
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <FileText className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard>
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari nama dokumen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "Semua" },
                    { value: "completed", label: "Completed" },
                    { value: "processing", label: "Processing" },
                    { value: "error", label: "Error" },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      variant={statusFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(filter.value as StatusFilter)}
                      className={statusFilter === filter.value ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" : ""}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GlassCard>

      {/* Documents List */}
      <GlassCard>
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white">
              Daftar Dokumen
            </CardTitle>
            <CardDescription>
              {filteredDocuments.length} dari {documents.length} dokumen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {searchQuery || statusFilter !== "all"
                    ? "Tidak ada dokumen yang cocok"
                    : "Belum ada dokumen"}
                </h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  {searchQuery || statusFilter !== "all"
                    ? "Coba ubah filter atau kata kunci pencarian"
                    : "Upload dokumen pertama kamu untuk mulai"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button
                    onClick={() => (window.location.href = "/dashboard/upload")}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload Sekarang
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => {
                  const statusConfig = getStatusConfig(doc.status);
                  const StatusIcon = statusConfig.icon;
                  const FileIcon = getFileIcon();

                  return (
                    <GlassCard key={doc.id} className="transition-all hover:shadow-md">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-600">
                            <FileIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">{doc.file_name}</h4>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                              <span>{formatDate(doc.uploaded_at)}</span>
                              {doc.chunksCount !== undefined && (
                                <span>• {doc.chunksCount} chunks</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className={statusConfig.color}>
                            <StatusIcon
                              className={`mr-1 h-3 w-3 ${
                                doc.status === "processing" ? "animate-spin" : ""
                              }`}
                            />
                            {statusConfig.label}
                          </Badge>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                              disabled={doc.status === "processing" || downloadingId === doc.id}
                            >
                              {downloadingId === doc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteId(doc.id)}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                              disabled={downloadingId === doc.id || deleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </GlassCard>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Dokumen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dokumen ini akan dihapus permanen dari storage dan database.
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

