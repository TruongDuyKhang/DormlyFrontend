// app/(student)/profile/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProfileTabs } from '../_components/profile-tabs';
import { SecuritySettings } from '../_components/security-settings';
import { ContactInfo } from '../_components/contact-info';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { Student } from '../_components/types';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { profile, isLoading: profileLoading } = useStudentProfile();
  const { user, isLoading: userLoading } = useCurrentUser();

  const normalizeGender = (g?: string): 'male' | 'female' | 'other' => {
    const lower = g?.toLowerCase();
    if (lower === 'male') return 'male';
    if (lower === 'female') return 'female';
    return 'other';
  };

  const student: Student = {
    id: user?.id || profile?.id || '',
    fullName: user?.fullName || '',
    studentId: profile?.studentCode || '',
    universityEmail: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: normalizeGender(user?.gender),
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    faculty: 'Khoa Công nghệ Thông tin',
    major: profile?.major || '',
    academicYear: profile?.startYear ? `${new Date().getFullYear() - profile.startYear + 1}` : '',
    avatar:
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=9d7443&color=fff&size=80`,
  };

  const isLoading = profileLoading || userLoading;

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            My Profile
          </p>
          <div className="flex items-center gap-3">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28241f] sm:text-5xl">
              Settings
            </h1>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-stone-500 mt-2" />}
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Manage your account security and contact preferences
          </p>
        </div>
        <ProfileTabs />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <SecuritySettings user={user} />
        <ContactInfo student={student} />
      </div>
    </div>
  );
}