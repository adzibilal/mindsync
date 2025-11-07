"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerBorderProps {
  children: ReactNode;
  className?: string;
  borderClassName?: string;
  duration?: number;
}

export function ShimmerBorder({
  children,
  className,
  borderClassName,
  duration = 2,
}: ShimmerBorderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl",
          "before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-transparent",
          "before:bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.5),transparent)] before:bg-[length:200%_100%]",
          "before:animate-[shimmer_2s_ease-in-out_infinite]",
          borderClassName
        )}
        style={{
          animation: `shimmer ${duration}s ease-in-out infinite`,
        }}
      />
      {children}
    </div>
  );
}

