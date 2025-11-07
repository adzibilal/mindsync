"use client";

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
  Zap,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const stats = [
    { value: "10K+", label: "Dokumen Diproses" },
    { value: "99.9%", label: "Akurasi AI" },
    { value: "24/7", label: "Available" },
    { value: "500+", label: "Users Aktif" },
  ];

  const features = [
    {
      title: "Upload Multi-Format",
      description:
        "Dukung berbagai format dokumen: PDF, Word, Excel, dan Text. Proses otomatis dalam hitungan detik.",
      icon: <Upload className="h-6 w-6 text-blue-400" />,
      className: "md:col-span-1",
    },
    {
      title: "AI Contextual Chat",
      description:
        "Chat dengan AI yang memahami seluruh konteks dokumen kamu. Dapatkan jawaban yang akurat dan relevan.",
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      className: "md:col-span-2",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30" />
      ),
    },
    {
      title: "WhatsApp Integration",
      description:
        "Akses knowledge base kamu langsung dari WhatsApp. Cepat, praktis, dan mudah digunakan.",
      icon: <MessageSquare className="h-6 w-6 text-green-400" />,
      className: "md:col-span-2",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30" />
      ),
    },
    {
      title: "Lightning Fast",
      description: "Response time dalam milidetik. AI yang cepat dan efisien.",
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      className: "md:col-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgb(59, 130, 246)"
      />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950" />

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Header */}
      <header className="relative z-50 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Brain className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">MindSync</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI-Powered Knowledge Base
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Your Personal AI Assistant
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                via WhatsApp
              </span>
            </h2>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Upload dokumen, chat dengan AI yang memahami konten kamu, dan akses
            knowledge base kamu kapan aja lewat WhatsApp.{" "}
            <span className="text-blue-300 font-semibold">Semudah itu!</span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 group"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fitur Unggulan ✨
          </h3>
          <p className="text-slate-200 text-lg">
            Solusi lengkap untuk knowledge management kamu
          </p>
        </motion.div>

        <BentoGrid>
          {features.map((feature, index) => (
            <BentoGridItem
              key={index}
              title={feature.title}
              description={feature.description}
              header={feature.header}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </BentoGrid>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cara Kerja 🎯
            </h3>
            <p className="text-slate-200 text-lg">
              Mulai dalam 3 langkah mudah
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                number: 1,
                title: "Daftar & Verifikasi WhatsApp",
                description:
                  "Daftar akun dengan nomor WhatsApp kamu. Verifikasi lewat OTP yang dikirim ke WhatsApp.",
                icon: Users,
                color: "from-blue-500 to-cyan-500",
              },
              {
                number: 2,
                title: "Upload Dokumen",
                description:
                  "Upload dokumen kamu ke dashboard. AI akan memproses dan membuat knowledge base dari konten dokumen.",
                icon: Upload,
                color: "from-purple-500 to-pink-500",
              },
              {
                number: 3,
                title: "Chat via WhatsApp",
                description:
                  "Langsung chat dengan AI assistant kamu via WhatsApp. Tanya apa aja tentang dokumen yang udah kamu upload!",
                icon: MessageSquare,
                color: "from-green-500 to-emerald-500",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start gap-6 group"
              >
                <div
                  className={`flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.number}
                </div>
                <div className="flex-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="h-6 w-6 text-blue-400" />
                    <h4 className="text-2xl font-semibold text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kenapa MindSync? 🚀
            </h3>
            <p className="text-slate-200 text-lg">
              Lebih dari sekedar knowledge base
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Aman & Terpercaya",
                description:
                  "Data kamu terenkripsi dan tersimpan dengan aman. Privacy adalah prioritas kami.",
              },
              {
                icon: Zap,
                title: "Super Cepat",
                description:
                  "Response time dalam milidetik. AI yang cepat dan efisien untuk produktivitas maksimal.",
              },
              {
                icon: Clock,
                title: "Akses 24/7",
                description:
                  "AI assistant kamu selalu siap membantu kapan pun kamu butuhkan, tanpa batas waktu.",
              },
              {
                icon: TrendingUp,
                title: "Terus Berkembang",
                description:
                  "AI yang terus belajar dan berkembang untuk memberikan hasil yang lebih baik.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <benefit.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-slate-200 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm shadow-2xl shadow-blue-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <CardHeader className="relative space-y-6 py-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex justify-center"
              >
                <BookOpen className="h-20 w-20 text-blue-400" />
              </motion.div>
              <CardTitle className="text-4xl md:text-5xl text-white">
                Siap untuk Mulai? 🚀
              </CardTitle>
              <CardDescription className="text-lg text-slate-200 max-w-2xl mx-auto">
                Daftar sekarang dan rasakan pengalaman baru dalam mengelola
                knowledge base kamu dengan AI!
              </CardDescription>
            </CardHeader>
            <CardContent className="relative pb-16 text-center">
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 group h-14 px-8 text-lg"
                    >
                      Daftar Gratis Sekarang
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <p className="text-sm text-slate-300">
                    Udah punya akun?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-blue-300 hover:text-blue-200 transition-colors underline-offset-4 hover:underline"
                    >
                      Sign in di sini
                    </Link>
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 px-4 py-1 text-slate-400 rounded-full">
                      Yang kamu dapatkan
                    </span>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {[
                    "Upload tanpa batas",
                    "AI response cepat",
                    "WhatsApp integration",
                    "Support 24/7",
                    "Data terenkripsi",
                    "Update gratis",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 text-slate-200 justify-center md:justify-start"
                    >
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-300" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <Brain className="h-6 w-6 text-blue-500" />
            <span className="font-semibold text-white">MindSync</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-slate-300"
          >
            © 2025 MindSync. Made with 💙 for smarter knowledge management.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
