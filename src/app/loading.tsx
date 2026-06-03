// app/loading.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Loading your experience",
  "Preparing your dashboard",
  "Waking up the servers",
  "Gathering your data",
  "Polishing pixels",
  "Almost there",
  "Finalizing setup",
];

const tips = [
  "💡 Did you know? You can request maintenance directly from your dashboard.",
  "💡 Quick tip: Use the search bar to find anything faster.",
  "💡 Pro tip: Customize your notification preferences in Settings.",
  "💡 Did you know? You can change your room preferences anytime.",
  "💡 Quick tip: Press '?' to see all keyboard shortcuts.",
];

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate progress from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        // Random increment between 2 and 8
        const increment = Math.floor(Math.random() * 7) + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    // Rotate messages every 1.5 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);

    // Rotate tips every 4 seconds
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f0e8] to-[#e8dfd3]">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#9d7443]/5"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#9d7443]/5"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9d7443]/3"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Logo với animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#2f2a24] shadow-2xl">
          <span className="text-5xl font-bold text-[#d6bd8a]">D</span>
        </div>
        <motion.div
          className="absolute inset-0 rounded-3xl bg-[#9d7443]/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-stone-700">
            {messages[messageIndex]}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-6 text-left"
            >
              ...
            </motion.span>
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar với số phần trăm */}
      <div className="mt-8 w-80 max-w-[80vw]">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-stone-500">Loading</span>
          <motion.span
            key={progress}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-sm font-semibold text-[#9d7443]"
          >
            {progress}%
          </motion.span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#9d7443] to-[#d6bd8a]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Shimmer effect on progress bar */}
      <motion.div
        className="mt-1 h-0.5 w-80 max-w-[80vw] overflow-hidden rounded-full bg-transparent"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      >
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#9d7443]/50 to-transparent" />
      </motion.div>

      {/* Tip section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 left-0 right-0 mx-auto max-w-md px-4 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-stone-400"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Particle dots khi gần xong */}
      {progress > 80 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#9d7443]"
              initial={{
                x: "50%",
                y: "50%",
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 2,
                opacity: 0,
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}