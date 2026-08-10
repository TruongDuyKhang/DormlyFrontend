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
import { useAuth } from "@/app/(auth)/context/auth-context"; 

interface HeaderProps {
  onMenuClick?: () => void;
}

const notifications = [

];

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth(); // 👈 lấy user thật + hàm logout thật
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState({ code: "en", label: "English" });
  const [isLoggingOut, setIsLoggingOut] = useState(false); 

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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout(); 
    } finally {
      setIsLoggingOut(false);
    }
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
        {/* Left section — giữ nguyên */}
        <div className="flex min-w-0 items-center gap-3">
          {/* ... không đổi */}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="header" onLanguageChange={handleLanguageChange} />

          {/* Notifications — giữ nguyên */}
          {/* ... */}

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
                    {(user?.fullname ?? "AD").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left md:block">
                  <span className="block text-sm font-semibold leading-none text-stone-800">
                    {user?.fullname ?? "Admin"}
                  </span>
                  <span className="mt-1 block text-xs text-stone-500">
                    {user?.roles?.[0] ?? "Administrator"}
                  </span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-75 border-white/60 bg-[#f3eee6]/95 text-stone-800 shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-stone-800 text-xs font-semibold text-stone-100">
                    {(user?.fullname ?? "AD").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{user?.fullname ?? "Admin"}</p>
                  <p className="text-xs text-stone-500">{user?.email ?? ""}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleProfile}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}