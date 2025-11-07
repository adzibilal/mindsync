"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  blur = "md",
  hover = true,
}: GlassCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/50 bg-white/80 shadow-sm",
        blurClasses[blur],
        hover && "transition-all duration-200 hover:shadow-md",
        "dark:border-slate-800/50 dark:bg-slate-900/80",
        className
      )}
    >
      {children}
    </div>
  );
}

