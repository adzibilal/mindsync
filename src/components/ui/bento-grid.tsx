"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 p-6 bg-slate-900/80 border border-slate-700 hover:border-blue-500/50 backdrop-blur-sm justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="mb-4">{icon}</div>
        <div className="font-sans font-bold text-white mb-3 text-xl">
          {title}
        </div>
        <div className="font-sans font-normal text-slate-200 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

