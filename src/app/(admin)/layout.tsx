"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { AuthGuard } from "@/components/admin/auth-guard";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname?.includes("/documents")) return "Documents";
    if (pathname?.includes("/upload")) return "Upload";
    if (pathname?.includes("/persona")) return "AI Persona";
    return "Dashboard";
  };

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Subtle Background Gradient */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Sidebar */}
        <aside className="hidden w-64 lg:block relative z-10">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {getPageTitle()}
              </h1>
              
              {/* Mobile Menu Button - to be implemented */}
              <button className="lg:hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

