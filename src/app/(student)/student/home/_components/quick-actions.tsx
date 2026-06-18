// app/(student)/home/_components/quick-actions.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Bot, MessageCircle, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  { label: "Report an issue", href: "/student/requests", icon: Wrench },
  { label: "Ask Dormly", href: "/student/chat/ai", icon: Bot },
  // { label: "Message office", href: "/student/chat", icon: MessageCircle },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {quickActions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
          >
            <Link
              href={action.href}
              className="group flex min-h-24 items-center justify-between rounded-[1.35rem] border border-white/60 bg-white/38 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl transition duration-300 hover:bg-white/58 active:scale-[0.98]"
            >
              <span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2a24] text-[#d6bd8a]">
                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <span className="mt-4 block text-sm font-semibold text-stone-900">
                  {action.label}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-700" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}