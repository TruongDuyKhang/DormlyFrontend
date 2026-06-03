'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Settings,
  Users,
  Zap,
  ClipboardList,
  Home,
  MessageCircle,
  Lock,
  AlertCircle,
  LogOut,
  Layers,
  Bot,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/_components/ui/tooltip";

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  signal?: string;
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { 
    icon: Home, 
    label: "Dashboard", 
    href: "/platform/dashboard",
  },
  { 
    icon: Users, 
    label: "Residents", 
    submenu: [
      { label: "Students", href: "/platform/residents/students" },
      { label: "Accounts", href: "/platform/residents/accounts" },
    ]
  },
  { 
    icon: ClipboardList, 
    label: "Operations", 
    submenu: [
      { label: "Rooms", href: "/platform/operations/rooms" },
      { label: "Complaints", href: "/platform/operations/complaints" },
      { label: "Tickets", href: "/platform/operations/tickets" },
      { label: "Chat", href: "/platform/operations/chat" },
    ]
  },
  { 
    icon: BarChart3, 
    label: "Analytics", 
    submenu: [
      { label: "Insights", href: "/platform/analytics/insights" },
      { label: "Reports", href: "/platform/analytics/reports" },
    ]
  },
  { 
    icon: MessageSquare, 
    label: "Communication", 
    submenu: [
      { label: "Notifications", href: "/platform/communication/notifications" },
    ]
  },
  { 
    icon: Settings, 
    label: "Settings", 
    submenu: [
      { label: "Residence Structure", href: "/platform/settings/structure" },
      { label: "AI Assistant", href: "/platform/settings/ai-assistant" },
      { label: "Activity Logs", href: "/platform/settings/activity-logs" },
    ]
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export function Sidebar({ collapsed, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Operations", "Dashboard", "Settings"]);

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const isSubmenuActive = (submenu?: SubMenuItem[]) => {
    if (!submenu) return false;
    return submenu.some(item => isActive(item.href));
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("dormly_language");
    localStorage.removeItem("dormly_profile");
    localStorage.removeItem("dormly_auth_token");
    localStorage.removeItem("dormly_user");
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <>
      {!collapsed && isMobile && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-stone-950/35 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-white/45 bg-[#27231f]/92 text-stone-100 shadow-[20px_0_80px_-55px_rgba(38,35,31,0.9)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "w-24" : "w-[19rem]",
          isMobile && collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Scrollbar Styling */}
        <style>{`
          .sidebar-nav::-webkit-scrollbar {
            width: 6px;
          }
          .sidebar-nav::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar-nav::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            transition: background 0.2s;
          }
          .sidebar-nav::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.35);
          }
        `}</style>

        {/* Header với logo - text sát bên logo */}
        <div className={cn("flex h-24 items-center border-b border-white/10 px-5 gap-3", collapsed ? "justify-center" : "")}>
          <Link href="/platform/dashboard" className={cn("flex items-center flex-shrink-0 gap-6", collapsed ? "justify-center" : "")}>
            {/* Logo - kích thước nhỏ, sát text */}
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo_white.png"
                alt="Dormly Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            {/* Text sát bên logo */}
            {!collapsed && (
              <div className="flex flex-col flex-shrink-0 gap-0">
                <span className="text-base font-semibold tracking-tight leading-tight text-white">Dormly</span>
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-stone-400 leading-tight">
                  ADMIN RESIDENCE OS
                </span>
              </div>
            )}
          </Link>

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-9 w-9 rounded-full text-stone-400 hover:bg-white/8 hover:text-stone-100 flex-shrink-0 ml-auto"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute -right-3 top-8 h-7 w-7 rounded-full border border-white/20 bg-[#2b2722] text-stone-300 shadow-lg hover:bg-[#383229] hover:text-stone-100"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-4 px-3 text-[0.66rem] font-medium uppercase tracking-[0.26em] text-stone-500">
            {!collapsed ? "Platform" : "Menu"}
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems.includes(item.label);
              const active = isActive(item.href) || isSubmenuActive(item.submenu);

              if (collapsed && hasSubmenu) {
                return (
                  <TooltipProvider key={item.label} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center">
                          <button className="flex h-12 w-12 items-center justify-center rounded-2xl text-stone-400 transition hover:bg-white/7 hover:text-stone-100">
                            <item.icon className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              if (hasSubmenu) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "group flex w-full min-h-12 items-center justify-between rounded-2xl px-3 text-sm transition duration-300 active:scale-[0.98]",
                        active
                          ? "bg-white/12 text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                          : "text-stone-400 hover:bg-white/7 hover:text-stone-100"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "h-4.5 w-4.5 transition",
                            active ? "text-[#d2b47c]" : "text-stone-500 group-hover:text-stone-200"
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          isExpanded ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <div className="mt-1.5 space-y-1 border-l border-white/10 pl-4 ml-3">
                        {item.submenu?.map((subitem) => {
                          const subActive = isActive(subitem.href);
                          return (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className={cn(
                                "group flex min-h-10 items-center rounded-lg px-3 text-xs transition duration-300 active:scale-[0.98]",
                                subActive
                                  ? "bg-white/12 text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                                  : "text-stone-400 hover:bg-white/7 hover:text-stone-100"
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full mr-2.5 transition",
                                  subActive ? "bg-[#d2b47c]" : "bg-stone-500 group-hover:bg-stone-200"
                                )}
                              />
                              {subitem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Single item without submenu
              return (
                <TooltipProvider key={item.label} delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href || "#"}
                        className={cn(
                          "group flex min-h-12 items-center justify-between rounded-2xl px-3 text-sm transition duration-300 active:scale-[0.98]",
                          collapsed ? "justify-center" : "gap-3",
                          active
                            ? "bg-white/12 text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                            : "text-stone-400 hover:bg-white/7 hover:text-stone-100"
                        )}
                      >
                        <span className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                          <item.icon
                            className={cn(
                              "h-4.5 w-4.5 transition",
                              active ? "text-[#d2b47c]" : "text-stone-500 group-hover:text-stone-200"
                            )}
                          />
                          {!collapsed && <span className="font-medium">{item.label}</span>}
                        </span>
                        {!collapsed && item.signal && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[0.65rem] font-medium",
                              active ? "bg-[#d2b47c]/18 text-[#e1c995]" : "bg-white/8 text-stone-400"
                            )}
                          >
                            {item.signal}
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </nav>

        {/* Footer - Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm text-stone-400 transition hover:bg-white/7 hover:text-stone-100 active:scale-[0.98]",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-4.5 w-4.5" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}