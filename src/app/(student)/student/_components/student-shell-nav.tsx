// app/(student)/_components/student-shell-nav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Bell,
  Bot,
  Home,
  MessageCircle,
  Sparkles,
  User,
  LogOut,
  Settings,
  Phone,
  Mail,
  AlertCircle,
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
import { useAuth } from "@/app/(auth)/context/auth-context";
import { notificationService } from "@/services/notificationService";
import type { NotificationLog } from "@/types/models";

const items = [
  { label: "Home", href: "/student/home", icon: Home },
  { label: "Residence", href: "/student/residence/room", icon: Sparkles },
  { label: "Requests", href: "/student/requests", icon: Bell },
  { label: "Chat", href: "/student/chat", icon: Bot },
  { label: "Profile", href: "/student/profile/account", icon: User },
];

export function StudentShellNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [studentInfo, setStudentInfo] = useState({
    name: "Student Resident",
    email: "student@dormly.edu",
    initials: "ST",
  });

  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      const name = user.fullname || user.email?.split("@")[0] || "Student";
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "ST";
      setStudentInfo({
        name,
        email: user.email || "student@dormly.edu",
        initials,
      });

      if (user.email) {
        setLoadingNotifs(true);
        notificationService.getLogs({ recipient: user.email })
          .then((res) => {
            const list = res?.content || (Array.isArray(res) ? res : []);
            setNotifications(list);
          })
          .catch((e) => console.warn("Could not fetch student notifications:", e))
          .finally(() => setLoadingNotifs(false));
      }
    }
  }, [user]);

  const isActive = (label: string, href: string) => {
    if (label === "Residence") {
      return (
        pathname?.startsWith("/student/residence") &&
        !pathname?.startsWith("/student/residence/requests")
      );
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const handleProfile = () => {
    router.push("/student/profile/account");
  };

  const handleSettings = () => {
    router.push("/student/profile/settings");
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/student/home"
          className="flex items-center gap-3 flex-shrink-0"
        >
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

        {/* Navigation Menu */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-white/60 bg-white/32 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
          {items.map((item) => {
            const active = isActive(item.label, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition",
                  active
                    ? "bg-[#2f2a24] text-[#d6bd8a] shadow-[0_12px_28px_-16px_rgba(47,42,36,0.85)]"
                    : "text-stone-600 hover:bg-white/45 hover:text-stone-900",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher, Support & Profile */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher variant="compact" />

          {/* Support Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-white/60 bg-white/32 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:bg-white/55"
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 border-white/60 bg-[#f3eee6]/95 p-4 text-stone-800 shadow-2xl backdrop-blur-xl"
            >
              <div className="space-y-3">
                <div className="border-b border-stone-200/80 pb-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Emergency & Support
                  </p>
                  <p className="text-sm font-semibold text-stone-800">
                    Dormitory Hotlines
                  </p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-xl bg-white/40 p-2.5">
                    <span className="font-medium text-stone-600">
                      Security Desk
                    </span>
                    <a
                      href="tel:0901234567"
                      className="flex items-center gap-1 font-semibold text-[#c3a26c] hover:underline"
                    >
                      <Phone className="h-3 w-3" /> 0901 234 567
                    </a>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/40 p-2.5">
                    <span className="font-medium text-stone-600">
                      Medical Support
                    </span>
                    <a
                      href="tel:0901234568"
                      className="flex items-center gap-1 font-semibold text-[#c3a26c] hover:underline"
                    >
                      <Phone className="h-3 w-3" /> 0901 234 568
                    </a>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/40 p-2.5">
                    <span className="font-medium text-stone-600">
                      Admin Email
                    </span>
                    <a
                      href="mailto:support@dormly.edu"
                      className="flex items-center gap-1 font-semibold text-[#c3a26c] hover:underline"
                    >
                      <Mail className="h-3 w-3" /> support@dormly.edu
                    </a>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Student Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full border border-white/60 bg-white/32 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:bg-white/55"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-sm">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 sm:w-96 border-white/60 bg-[#f3eee6]/95 p-4 text-stone-800 shadow-2xl backdrop-blur-xl max-h-96 overflow-y-auto"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-stone-800">
                    <Bell className="h-4 w-4 text-[#c3a26c]" />
                    <span>Thông Báo Sinh Viên</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500 bg-white/60 px-2 py-0.5 rounded-full">
                    {notifications.length} thông báo
                  </span>
                </div>

                {loadingNotifs ? (
                  <div className="py-6 text-center text-xs text-stone-500">Đang tải thông báo...</div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((n, idx) => (
                      <div key={n.eventId || idx} className="rounded-xl border border-white/60 bg-white/50 p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-stone-900">{n.subject || 'Thông báo ký túc xá'}</span>
                          <span className="text-[10px] text-stone-400">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-stone-500">Chưa có thông báo nào dành cho bạn.</div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-2 rounded-full border border-white/60 bg-white/32 px-2 pr-3 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:bg-white/55"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(studentInfo.name)}&background=2f2a24&color=d6bd8a&size=64`} alt={studentInfo.name} />
                  <AvatarFallback className="bg-[#2f2a24] text-xs font-semibold text-[#d6bd8a]">
                    {studentInfo.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold text-stone-800">
                  {studentInfo.name.split(" ")[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-white/60 bg-[#f3eee6]/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#2f2a24] text-xs font-semibold text-[#d6bd8a]">
                    {studentInfo.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="text-sm font-semibold text-stone-800 truncate">
                    {studentInfo.name}
                  </p>
                  <p className="text-xs text-stone-500 truncate">{studentInfo.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={handleProfile}
              >
                <User className="h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[1.5rem] border border-white/60 bg-[#f7f2ea]/86 p-1.5 shadow-[0_24px_60px_-38px_rgba(38,35,31,0.75),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl lg:hidden">
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
                  : "text-stone-500 hover:bg-white/55",
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
