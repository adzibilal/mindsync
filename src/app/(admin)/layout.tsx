"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { AuthGuard } from "@/components/admin/auth-guard";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Sidebar */}
        <aside className="hidden w-64 lg:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Dashboard
              </h1>
              
              {/* Mobile Menu Button - to be implemented */}
              <button className="lg:hidden">
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
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}

