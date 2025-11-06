import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mindsync - Temen Asisten AI Kamu yang Siap Bantu!",
  description: "Hai! Mini di sini ✨ Asisten AI yang siap bantu kamu kelola informasi dan chat dengan lebih cerdas. Gampang kok, yuk cobain!",
  keywords: ["mindsync", "asisten ai", "chatbot", "ai assistant", "knowledge base", "mini"],
  authors: [{ name: "Mindsync Team" }],
  creator: "Mindsync",
  publisher: "Mindsync",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mindsync.magang.pro",
    siteName: "Mindsync",
    title: "Mindsync - Temen Asisten AI Kamu yang Siap Bantu!",
    description: "Hai! Mini di sini ✨ Asisten AI yang siap bantu kamu kelola informasi dan chat dengan lebih cerdas. Gampang kok, yuk cobain!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindsync - Temen Asisten AI Kamu yang Siap Bantu!",
    description: "Hai! Mini di sini ✨ Asisten AI yang siap bantu kamu kelola informasi dan chat dengan lebih cerdas. Gampang kok, yuk cobain!",
  },
  icons: {
    icon: [
      { url: "/images/logos/icon-logo.png" },
      { url: "/images/logos/icon-logo.png", sizes: "16x16", type: "image/png" },
      { url: "/images/logos/icon-logo.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/images/logos/icon-logo.png",
    apple: "/images/logos/icon-logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
