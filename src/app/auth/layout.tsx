import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6 p-8">
          <Image
            src="/images/logos/logo-vertical.png"
            alt="Mindsync Logo"
            width={200}
            height={200}
            className="w-48 h-auto"
            priority
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Welcome to Mindsync
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md">
              Your Second Brain for Document Management. Collaborate, share, and manage documents through chat.
            </p>
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">86M</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">WhatsApp Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">AI Assistant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Image
                src="/images/logos/logo-landscape.png"
                alt="Mindsync Logo"
                width={150}
                height={50}
                className="w-40 h-auto"
                priority
              />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

