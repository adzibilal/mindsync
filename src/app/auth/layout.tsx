"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Brain, Shield, Zap, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col items-start justify-center space-y-8 p-8"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <Brain className="h-12 w-12 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-3xl font-bold text-white">MindSync</span>
            </Link>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Welcome to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  MindSync
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                Your Second Brain for Document Management. Collaborate, share, and manage documents through AI-powered chat.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {[
                { icon: Shield, label: "Secure & Encrypted", color: "from-blue-500 to-cyan-500" },
                { icon: Zap, label: "Lightning Fast", color: "from-purple-500 to-pink-500" },
                { icon: MessageSquare, label: "WhatsApp Integration", color: "from-green-500 to-emerald-500" },
                { icon: Brain, label: "AI-Powered", color: "from-orange-500 to-red-500" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm text-slate-200 font-medium">{feature.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">10K+</div>
                <div className="text-sm text-slate-400">Documents</div>
              </div>
              <div className="h-12 w-px bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">99.9%</div>
                <div className="text-sm text-slate-400">Uptime</div>
              </div>
              <div className="h-12 w-px bg-slate-700"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-slate-400">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
                <Brain className="h-10 w-10 text-blue-500" />
                <span className="text-2xl font-bold text-white">MindSync</span>
              </Link>
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

