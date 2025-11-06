import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  MessageSquare,
  Upload,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">MindSync</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Knowledge Base
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Your Personal AI Assistant
            <br />
            <span className="text-blue-600">via WhatsApp</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload dokumen, chat dengan AI yang memahami konten kamu, dan akses knowledge base kamu kapan aja lewat WhatsApp. Semudah itu! 🚀
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Fitur Unggulan ✨</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Solusi lengkap untuk knowledge management kamu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Upload Dokumen</CardTitle>
              <CardDescription>
                Upload berbagai format dokumen (PDF, Word, Excel, Text) dan biarkan AI memproses konten kamu secara otomatis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>AI Smart Chat</CardTitle>
              <CardDescription>
                Chat dengan AI yang memahami konteks dokumen kamu. Tanya apa aja, AI siap bantu jawab berdasarkan knowledge base kamu.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>WhatsApp Integration</CardTitle>
              <CardDescription>
                Akses AI assistant kamu langsung dari WhatsApp. Nggak perlu buka aplikasi lain, cukup chat aja! 💬
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white dark:bg-slate-900/50 rounded-3xl my-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Cara Kerja 🎯</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Mulai dalam 3 langkah mudah
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Daftar & Verifikasi WhatsApp</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Daftar akun dengan nomor WhatsApp kamu. Verifikasi lewat OTP yang dikirim ke WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Upload Dokumen</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Upload dokumen kamu ke dashboard. AI akan memproses dan membuat knowledge base dari konten dokumen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Chat via WhatsApp</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Langsung chat dengan AI assistant kamu via WhatsApp. Tanya apa aja tentang dokumen yang udah kamu upload!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-3xl mx-auto border-slate-200 dark:border-slate-800 shadow-2xl">
          <CardHeader className="space-y-4 py-12">
            <div className="flex justify-center">
              <BookOpen className="h-16 w-16 text-blue-600" />
            </div>
            <CardTitle className="text-3xl">
              Siap untuk Mulai? 🚀
            </CardTitle>
            <CardDescription className="text-lg">
              Daftar sekarang dan rasakan pengalaman baru dalam mengelola knowledge base kamu dengan AI!
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Daftar Gratis Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Udah punya akun?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="font-semibold">MindSync</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2025 MindSync. Made with 💙 for smarter knowledge management.
          </p>
        </div>
      </footer>
    </div>
  );
}
