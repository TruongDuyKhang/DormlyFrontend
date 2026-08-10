"use client";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { StudentShellNav } from "./_components/student-shell-nav";

// Role từ backend: "User"
const STUDENT_ROLES = ["User"];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checked, loading } = useRoleGuard(STUDENT_ROLES, "/platform/dashboard");

  if (loading || !checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f2ede4]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f2ede4] text-[#26231f]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_14%_4%,rgba(255,255,255,0.95),transparent_26%),radial-gradient(circle_at_84%_0%,rgba(184,151,104,0.2),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.48),rgba(221,211,196,0.34))]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(152,133,105,0.16),transparent)]" />

      <header className="sticky top-0 z-30 border-b border-white/55 bg-[#f2ede4]/82 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <StudentShellNav />
        </div>
      </header>

      <main className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {children}
      </main>
    </div>
  );
}