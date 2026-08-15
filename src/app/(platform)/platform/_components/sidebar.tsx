'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  Receipt,
  ArrowLeftRight,
  FileCheck2,
  ShieldCheck,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/_components/ui/tooltip";
import { useAuth } from "@/app/(auth)/context/auth-context";

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
      { label: "Assignments", href: "/platform/residents/assignments" },
      { label: "Accounts", href: "/platform/residents/accounts" },
      { label: "Documents", href: "/platform/residents/documents" },
    ]
  },
  { 
    icon: ClipboardList, 
    label: "Operations", 
    submenu: [
      { label: "Building Map", href: "/platform/operations/rooms" },
      { label: "Service Tickets", href: "/platform/operations/tickets" },
      { label: "Room Transfers", href: "/platform/operations/transfers" },
      { label: "Invoices & Billing", href: "/platform/operations/invoices" },
    ]
  },
  { 
    icon: MessageSquare, 
    label: "Communication", 
    submenu: [
      { label: "Notifications & News", href: "/platform/communication/notifications" },
    ]
  },
  { 
    icon: BarChart3, 
    label: "Analytics", 
    submenu: [
      { label: "Insights", href: "/platform/analytics/insights" },
    ]
  },
  { 
    icon: Settings, 
    label: "Settings", 
    submenu: [
      { label: "Residence Structure", href: "/platform/settings/structure" },
      { label: "Roles & Permissions", href: "/platform/settings/roles" },
      { label: "System Events", href: "/platform/settings/activity-logs" },
      { label: "AI Assistant", href: "/platform/settings/ai-assistant" },
    ]
  },
];

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onClose, collapsed: propCollapsed, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Residents: true,
    Operations: true,
    Settings: true,
  });
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = propCollapsed !== undefined ? propCollapsed : localCollapsed;
  const setCollapsed = onToggle || setLocalCollapsed;

  // Auto-expand submenu if current path matches
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu?.some((sub) => pathname.startsWith(sub.href))) {
        setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggleSubmenu = (label: string) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (item: MenuItem) => {
    if (item.href) {
      return pathname === item.href || pathname?.startsWith(`${item.href}/`);
    }
    if (item.submenu) {
      return item.submenu.some((sub) => pathname.startsWith(sub.href));
    }
    return false;
  };

  const isSubmenuActive = (sub: SubMenuItem) => {
    return pathname === sub.href || pathname?.startsWith(`${sub.href}/`);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-screen flex-col border-r border-white/55 bg-[#e8e2d8]/85 shadow-[0_20px_50px_rgba(38,35,31,0.06)] backdrop-blur-2xl transition-all duration-300",
        collapsed ? "w-20" : "w-72",
        isMobile && (collapsed ? "-translate-x-full" : "translate-x-0")
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-5 border-b border-white/45">
        <Link
          href="/platform/dashboard"
          className={cn("flex items-center gap-3", collapsed && "justify-center")}
        >
          <div className="flex h-11 w-11 items-center justify-center">
            <Image
              src="/logo_black.png"
              alt="Dormly"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-stone-900 leading-tight">
                DORMLY
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500 font-semibold leading-tight">
                Management OS
              </span>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-full p-1.5 text-stone-400 hover:bg-white/60 hover:text-stone-700 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const hasSubmenu = Boolean(item.submenu);
          const isOpen = openMenus[item.label];

          if (hasSubmenu) {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition group",
                    active
                      ? "bg-white/75 text-stone-900 shadow-sm"
                      : "text-stone-600 hover:bg-white/45 hover:text-stone-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", active ? "text-[#c3a26c]" : "text-stone-500")} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-stone-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {!collapsed && isOpen && item.submenu && (
                  <div className="pl-9 space-y-1 pt-0.5">
                    {item.submenu.map((sub) => {
                      const subActive = isSubmenuActive(sub);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className={cn(
                            "block rounded-lg px-3 py-1.5 text-xs font-medium transition",
                            subActive
                              ? "bg-[#c3a26c]/15 text-[#8f6d38] font-bold"
                              : "text-stone-500 hover:text-stone-900 hover:bg-white/40"
                          )}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href || "#"}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-white/75 text-stone-900 shadow-sm"
                  : "text-stone-600 hover:bg-white/45 hover:text-stone-900"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-[#c3a26c]" : "text-stone-500")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/45">
        <button
          onClick={() => logout()}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50/80 transition",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full mt-2 flex items-center justify-center p-2 text-stone-400 hover:text-stone-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}