"use client";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { ThemeProvider } from "next-themes";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Roles từ backend: "Manager", "Admin", "Staff"
const PLATFORM_ROLES = ["Manager", "Admin", "Staff"];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checked, loading } = useRoleGuard(PLATFORM_ROLES, "/student/home");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading || !checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#e8e2d8]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-[100dvh] bg-[#e8e2d8] text-stone-950">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.78),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(156,123,79,0.16),transparent_24%),linear-gradient(135deg,rgba(247,244,238,0.72),rgba(207,197,183,0.36))]" />
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
          isMobile={isMobile}
        />
        {/* Mobile backdrop overlay when sidebar is open */}
        {isMobile && !sidebarCollapsed && (
          <div
            className="fixed inset-0 z-20 bg-stone-950/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        <div
          className={cn(
            "relative transition-[margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isMobile ? "ml-0" : sidebarCollapsed ? "ml-20" : "ml-72"
          )}
        >
          <Header onMenuClick={() => setSidebarCollapsed((prev) => !prev)} />
          <main className="px-3 pb-5 pt-3 sm:px-5 sm:pb-8 lg:px-7">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}