// app/(student)/chat/_components/chat-tabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Messages", href: "/student/chat/messages", icon: MessageCircle },
  { label: "Dormly AI", href: "/student/chat/ai", icon: Bot },
];

export function ChatTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-full border border-white/60 bg-white/34 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.98]",
              active
                ? "bg-[#2f2a24] text-white shadow-md"
                : "text-stone-600 hover:bg-white/50 hover:text-stone-900"
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-[#d6bd8a]" : "text-stone-500")} />
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}