"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserData } from "@/utils/cookies";
import {
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";

interface DocumentStats {
  total: number;
  completed: number;
  processing: number;
  error: number;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    completed: 0,
    processing: 0,
    error: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    if (data?.whatsapp_number) {
      fetchDocumentStats(data.whatsapp_number as string);
    }
  }, []);

  const fetchDocumentStats = async (whatsappNumber: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/documents/list?whatsapp_number=${whatsappNumber}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        const documents = data.data;
        setStats({
          total: documents.length,
          completed: documents.filter((d: { status: string }) => d.status === "completed").length,
          processing: documents.filter((d: { status: string }) => d.status === "processing").length,
          error: documents.filter((d: { status: string }) => d.status === "error").length,
        });
      }
    } catch (error) {
      console.error("Error fetching document stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Dokumen",
      value: loading ? "..." : stats.total.toString(),
      description: "Semua dokumen",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Completed",
      value: loading ? "..." : stats.completed.toString(),
      description: "Siap digunakan",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Processing",
      value: loading ? "..." : stats.processing.toString(),
      description: "Sedang diproses",
      icon: Loader2,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
    },
    {
      title: "Error",
      value: loading ? "..." : stats.error.toString(),
      description: "Gagal diproses",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, {(userData?.name as string) || "User"}! 👋
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Here&apos;s what&apos;s happening with your documents today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.title} className="h-full transition-shadow hover:shadow-md">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard 
          className="cursor-pointer h-full transition-all hover:shadow-md"
          onClick={() => router.push("/dashboard/upload")}
        >
          <Card className="border-0 bg-transparent shadow-none h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-600 p-3">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-600 dark:text-blue-400">
                    Upload Document
                  </CardTitle>
                  <CardDescription>
                    Tambah file baru
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload PDF, DOCX, atau gambar ke knowledge base kamu
              </p>
            </CardContent>
          </Card>
        </GlassCard>

        <GlassCard 
          className="cursor-pointer h-full transition-all hover:shadow-md"
          onClick={() => router.push("/dashboard/documents")}
        >
          <Card className="border-0 bg-transparent shadow-none h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-600 p-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-600 dark:text-green-400">
                    View Documents
                  </CardTitle>
                  <CardDescription>
                    Lihat semua file
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kelola dan download dokumen yang sudah diupload
              </p>
            </CardContent>
          </Card>
        </GlassCard>

        <GlassCard 
          className="cursor-pointer h-full transition-all hover:shadow-md"
          onClick={() => router.push("/dashboard/persona")}
        >
          <Card className="border-0 bg-transparent shadow-none h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-600 p-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-purple-600 dark:text-purple-400">
                    AI Persona
                  </CardTitle>
                  <CardDescription>
                    Atur persona AI
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Customize personality dan behavior AI assistant kamu
              </p>
            </CardContent>
          </Card>
        </GlassCard>
      </div>

      {/* Getting Started Guide */}
      <GlassCard>
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              Getting Started with Mindsync
            </CardTitle>
            <CardDescription>
              Follow these steps to make the most of your second brain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  1
                </div>
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  Upload Documents
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Start by uploading your documents, PDFs, images, or text files to build
                  your knowledge base. Mendukung OCR untuk gambar!
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
                  2
                </div>
                <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  Configure AI Persona
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Customize your AI assistant&apos;s personality and behavior to match your
                  needs. Buat AI kamu punya karakter unik!
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                  3
                </div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Start Chatting
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use WhatsApp to chat with your AI assistant and access your
                  documents anytime, anywhere. Chat sepuasnya!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </GlassCard>
    </div>
  );
}
