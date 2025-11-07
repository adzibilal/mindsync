"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  blur?: string;
  yOffset?: number;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  blur = "6px",
  yOffset = 6,
}: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: `blur(${blur})`, y: yOffset }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

