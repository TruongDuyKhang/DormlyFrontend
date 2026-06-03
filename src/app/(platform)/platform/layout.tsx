"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-[100dvh] bg-[#e8e2d8] text-stone-950">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.78),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(156,123,79,0.16),transparent_24%),linear-gradient(135deg,rgba(247,244,238,0.72),rgba(207,197,183,0.36))]" />
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
          isMobile={isMobile}
        />
        <div
          className={cn(
            "relative transition-[margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isMobile ? "ml-0" : sidebarCollapsed ? "ml-24" : "ml-[19rem]"
          )}
        >
          <Header onMenuClick={() => setSidebarCollapsed(false)} />
          <main className="px-3 pb-5 pt-3 sm:px-5 sm:pb-8 lg:px-7">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
 
