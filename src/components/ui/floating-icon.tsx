"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingIconProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FloatingIcon({
  children,
  className,
}: FloatingIconProps) {
  // Removed animation for more professional look
  return (
    <div className={cn("inline-block", className)}>
      {children}
    </div>
  );
}

