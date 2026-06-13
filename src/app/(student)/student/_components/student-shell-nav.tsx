// app/(student)/_components/student-shell-nav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  Bell,
  Bot,
  Home,
  MessageCircle,
  Sparkles,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/_components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar";
import { Button } from "@/_components/ui/button";

const items = [
  { label: "Home", href: "/student/home", icon: Home },
  { label: "Residence", href: "/student/residence/room", icon: Sparkles },
  { label: "Requests", href: "/student/requests", icon: Bell },
  // { label: "Community", href: "/student/community/feed", icon: MessageCircle },
   { label: "Chat", href: "/student/chat", icon: Bot },
  { label: "Profile", href: "/student/profile/account", icon: User },
];

// Mock notifications
const notifications = [
  {
    id: "1",
    title: "Maintenance Update",
    message: "Your AC repair request has been assigned to a technician.",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Document Approved",
    message: "Your Citizen ID has been verified by the residence office.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Event Reminder",
    message: "Football Tournament starts tomorrow at 8:00 AM.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "Room Transfer",
    message: "Your room transfer request has been approved.",
    time: "Yesterday",
    read: true,
  },
];

export function StudentShellNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter((n) => !n.read).length
  );

  const isActive = (label: string, href: string) => {
    if (label === "Residence") {
      return (
        pathname?.startsWith("/student/residence") &&
        !pathname?.startsWith("/student/residence/requests")
      );
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const handleLanguageChange = (langCode: string) => {
    console.log("Language changed to:", langCode);
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
    router.push("/student/profile/account");
  };

  const handleSettings = () => {
    router.push("/student/profile/settings");
  };

  const handleMarkAsRead = (id: string) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Logo bên trái */}
        <Link href="/student/home" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
            <Image
              src="/logo_black.png"
              alt="Dormly Logo"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-base font-semibold tracking-tight leading-tight text-stone-900">
              Dormly
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-stone-500 leading-tight">
              Student Residence
            </span>
          </div>
        </Link>

        {/* Navigation Menu - ở giữa màn hình */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-white/60 bg-white/32 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
          {items.map((item) => {
            const active = isActive(item.label, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition duration-300 active:scale-[0.98]",
                  active
                    ? "bg-[#2f2a24] text-stone-50 shadow-[0_12px_28px_-18px_rgba(47,42,36,0.8)]"
                    : "text-stone-600 hover:bg-white/50 hover:text-stone-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-[#d6bd8a]" : "text-stone-500"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bên phải - Notifications + Language Switcher + Avatar */}
        <div className="flex items-center gap-2">
          {/* Notifications Button - Style theo yêu cầu */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label="Open notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/38 text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition hover:bg-white/60 active:scale-[0.98]"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#a77d45]" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 border-white/60 bg-[#f3eee6]/95 p-0 text-stone-800 shadow-2xl backdrop-blur-xl"
            >
              <div className="border-b border-stone-200 px-4 py-3">
                <p className="text-sm font-semibold text-stone-900">Notifications</p>
                <p className="text-xs text-stone-500">Stay updated with residence activities</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`w-full px-4 py-3 text-left transition hover:bg-white/50 ${
                      !notif.read ? "bg-amber-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">
                          {notif.title}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {notif.message}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-[#9d7443]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-stone-200 px-4 py-2">
                <button
                  onClick={() => router.push("/student/notifications")}
                  className="w-full text-center text-xs font-semibold text-[#9d7443] hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Language Switcher */}
          <LanguageSwitcher variant="header" onLanguageChange={handleLanguageChange} />

          {/* Avatar Dropdown - Ngoài cùng bên phải */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-full border border-white/60 bg-white/38 p-0 hover:bg-white/60"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback className="bg-[#2f2a24] text-xs font-semibold text-[#d6bd8a]">
                    DK
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/60 bg-[#f3eee6]/95 backdrop-blur-xl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#2f2a24] text-xs font-semibold text-[#d6bd8a]">
                    DK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Trương Duy Khang</p>
                  <p className="text-xs text-stone-500">Student</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleProfile}>
                <User className="h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleSettings}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-[1.5rem] border border-white/60 bg-[#f7f2ea]/86 p-1.5 shadow-[0_24px_60px_-38px_rgba(38,35,31,0.75),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl lg:hidden">
        {items.map((item) => {
          const active = isActive(item.label, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex h-12 items-center justify-center rounded-[1.1rem] transition active:scale-[0.96]",
                active
                  ? "bg-[#2f2a24] text-[#d6bd8a]"
                  : "text-stone-500 hover:bg-white/55"
              )}
            >
              <Icon className="h-[1.125rem] w-[1.125rem]" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}