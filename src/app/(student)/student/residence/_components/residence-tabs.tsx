// app/(student)/residence/_components/residence-tabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Room", href: "/student/residence/room", icon: Home },
  { label: "Documents", href: "/student/residence/documents", icon: FileText },
];

export function ResidenceTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full gap-2 overflow-x-auto rounded-full border border-white/60 bg-white/34 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl sm:w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active =
          pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition active:scale-[0.98]",
              active
                ? "bg-[#2f2a24] text-stone-50"
                : "text-stone-600 hover:bg-white/58 hover:text-stone-900"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                active ? "text-[#d6bd8a]" : "text-stone-500"
              )}
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}