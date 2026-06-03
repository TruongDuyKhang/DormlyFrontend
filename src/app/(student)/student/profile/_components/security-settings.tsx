// app/(student)/profile/_components/security-settings.tsx
"use client";

import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export function SecuritySettings() {
  return (
    <div className="rounded-xl border-2 border-stone-300/80 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-[#9d7443]" />
        <h3 className="text-lg font-bold text-stone-900">Security</h3>
      </div>

      <div className="space-y-2">
        <Link
          href="/change-password"
          className="flex items-center justify-between rounded-xl border border-stone-200 p-4 transition hover:border-[#9d7443]/30 hover:bg-stone-50"
        >
          <div>
            <p className="font-semibold text-stone-900">Change Password</p>
            <p className="mt-0.5 text-sm text-stone-500">Update your account password</p>
          </div>
          <ChevronRight className="h-5 w-5 text-stone-400" />
        </Link>
      </div>
    </div>
  );
}