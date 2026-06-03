// app/(platform)/platform/_components/header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BellRing,
  LogOut,
  Menu,
  ShieldCheck,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/popover";
import { LanguageSwitcher } from "@/_components/LanguageSwitcher";

interface HeaderProps {
  onMenuClick?: () => void;
}

const notifications = [
  {
    title: "Central Court inspection",
    message: "Riser pressure review assigned to maintenance.",
    time: "8 min ago",
    urgent: false,
  },
  {
    title: "North House arrival",
    message: "Two residents checked in after evening desk handoff.",
    time: "24 min ago",
    urgent: false,
  },
  {
    title: "Governance packet",
    message: "Weekly occupancy report is ready for admin review.",
    time: "1 hour ago",
    urgent: true,
  },
];

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState({ code: "en", label: "English" });

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("dormly_language");
    if (savedLang) {
      setLanguage(savedLang === "en" ? { code: "en", label: "English" } : { code: "vi", label: "Tiếng Việt" });
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode === "en" ? { code: "en", label: "English" } : { code: "vi", label: "Tiếng Việt" });
  };

  const handleLogout = () => {
    localStorage.removeItem("dormly_language");
    localStorage.removeItem("dormly_profile");
    localStorage.removeItem("dormly_auth_token");
    localStorage.removeItem("dormly_user");
    sessionStorage.clear();
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/platform/profile");
  };

  const formattedDate = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <header className="sticky top-0 z-30 border-b border-white/45 bg-[#e8e2d8]/78 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-3 sm:px-5 lg:px-7">
        {/* Left section */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-stone-600 hover:bg-white/45 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/platform/dashboard" className="hidden min-w-0 sm:block">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Operations
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-stone-600">
              <span className="font-medium">Command Center</span>
              <span className="h-1 w-1 rounded-full bg-stone-400" />
              <span className="truncate">{formattedDate}</span>
            </div>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Language Switcher - Sử dụng component đã import */}
          <LanguageSwitcher variant="header" onLanguageChange={handleLanguageChange} />

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full border border-white/45 bg-white/25 text-stone-600 hover:bg-white/45"
              >
                <BellRing className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#c3a26c] animate-pulse" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 border-white/60 bg-[#f3eee6]/95 p-2 text-stone-800 shadow-2xl backdrop-blur-xl">
              <div className="px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Notifications</p>
                <p className="mt-1 text-xs text-stone-500">Recent activity in the system</p>
              </div>
              <div className="mt-1 divide-y divide-stone-200">
                {notifications.map((notif) => (
                  <button
                    key={notif.title}
                    className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-white/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-stone-800">{notif.title}</p>
                        {notif.urgent && (
                          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs text-stone-400">{notif.time}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-stone-500">{notif.message}</p>
                  </button>
                ))}
              </div>
              <div className="mt-2 px-3 py-2 border-t border-stone-200">
                <button className="w-full text-center text-xs font-semibold text-[#c3a26c] hover:underline">
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 gap-2 rounded-full border border-white/45 bg-white/28 px-2 pr-3 text-stone-700 hover:bg-white/45"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="Admin avatar" />
                  <AvatarFallback className="bg-stone-800 text-xs font-semibold text-stone-100">
                    AD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left md:block">
                  <span className="block text-sm font-semibold leading-none text-stone-800">
                    Ari Renard
                  </span>
                  <span className="mt-1 block text-xs text-stone-500">Administrator</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/60 bg-[#f3eee6]/95 text-stone-800 shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-stone-800 text-xs font-semibold text-stone-100">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Ari Renard</p>
                  <p className="text-xs text-stone-500">ari@dormly.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleProfile}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}