"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken, getUserData } from "@/utils/cookies";
import { isTokenExpired } from "@/utils/jwt-client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  readonly children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const userData = getUserData();

      // If no token, redirect to login
      if (!token) {
        router.push(`/auth/login?redirect=${pathname}`);
        return;
      }

      // Check if token is expired (client-side check)
      if (isTokenExpired(token)) {
        // Token expired, redirect to login
        router.push(`/auth/login?redirect=${pathname}`);
        return;
      }

      // Check if user data exists
      if (!userData?.whatsapp_number) {
        router.push(`/auth/login?redirect=${pathname}`);
        return;
      }

      // All checks passed
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

