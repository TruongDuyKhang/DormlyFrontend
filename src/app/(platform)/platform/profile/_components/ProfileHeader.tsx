// app/(platform)/platform/profile/_components/ProfileHeader.tsx
'use client';

import { User } from 'lucide-react';

export function ProfileHeader() {
  return (
    <div className="mb-6">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
        <User className="h-3.5 w-3.5" />
        Account Settings
      </div>
      <div>
        <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Manage your account settings, security, and preferences
        </p>
      </div>
    </div>
  );
}