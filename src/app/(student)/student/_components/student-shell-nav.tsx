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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfile = () => {
    router.push("/student/profile/account");
  };

  const handleSettings = () => {
    router.push("/student/profile/settings");
  };

  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "SV";

  return (
    <>
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Logo */}
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

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Emergency Contact */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label="Emergency contact"
                className="relative flex h-9 items-center gap-1.5 rounded-full border-2 border-red-400/80 bg-red-500/90 px-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:bg-red-600/90 hover:border-red-500 active:scale-[0.98]"
              >
                <AlertCircle className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-semibold hidden xl:inline tracking-wide">
                  Emergency
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-72 border-red-200/60 bg-[#f3eee6]/95 p-4 text-stone-800 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-2.5 border-b-2 border-red-200 pb-2.5 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    Emergency Contact
                  </p>
                  <p className="text-xs text-stone-500">Available 24/7</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href="tel:+842742222230"
                  className="flex items-center gap-2.5 rounded-lg p-2.5 transition hover:bg-white/60 group border border-transparent hover:border-red-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 group-hover:scale-105 transition-transform">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-900">Phone</p>
                    <p className="text-xs text-stone-600 font-medium">
                      0274 2222 230
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:Housing@eiu.edu.vn"
                  className="flex items-center gap-2.5 rounded-lg p-2.5 transition hover:bg-white/60 group border border-transparent hover:border-blue-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:scale-105 transition-transform">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-900">Email</p>
                    <p className="text-xs text-stone-600 font-medium truncate">
                      Housing@eiu.edu.vn
                    </p>
                  </div>
                </a>

                <div className="mt-2.5 rounded-lg bg-red-50/80 p-2.5 border-2 border-red-200/60">
                  <p className="text-xs text-stone-700 leading-relaxed">
                    <span className="font-semibold text-red-700">
                      For emergencies:
                    </span>{" "}
                    Contact security or residence staff immediately.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Language Switcher */}
          <LanguageSwitcher
            variant="header"
            onLanguageChange={handleLanguageChange}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-full border border-white/60 bg-white/38 p-0 hover:bg-white/60"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback className="bg-[#2f2a24] text-xs font-semibold text-[#d6bd8a]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-white/60 bg-[#f3eee6]/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#2f2a24] text-xs font-semibold text-[#d6bd8a]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {user?.fullname ?? "Student"}
                  </p>
                  <p className="text-xs text-stone-500">
                    {user?.roles?.[0] ?? "Student"}
                  </p>
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