"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FloatingPanelProps = {
  children: ReactNode;
  className?: string;
  floatAmount?: number;
};

export function FloatingPanel({
  children,
  className,
  floatAmount = 24,
}: FloatingPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [floatAmount, 0, -floatAmount]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-0.6, 0.6]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
