// app/(student)/profile/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProfileTabs } from '../_components/profile-tabs';
import { SecuritySettings } from '../_components/security-settings';
import { ContactInfo } from '../_components/contact-info';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import type { Student } from '../_components/types';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { profile, isLoading } = useStudentProfile();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('session.user') || localStorage.getItem('user');
        if (item) {
          setCurrentUser(JSON.parse(item));
        }
      } catch (e) {
        console.warn('Could not read user from storage:', e);
      }
    }
  }, []);

  const student: Student = {
    id: profile?.id || currentUser?.id || '1',
    fullName: currentUser?.fullName || profile?.friendName || 'Phạm Văn Một',
    studentId: profile?.studentCode || 'SV2021001',
    universityEmail: currentUser?.email || 'user1@gmail.com',
    phoneNumber: currentUser?.phoneNumber || '0934567890',
    gender: (currentUser?.gender?.toLowerCase() as any) || 'male',
    dateOfBirth: currentUser?.dateOfBirth || '2003-02-14',
    faculty: 'Khoa Công nghệ Thông tin',
    major: profile?.major || 'Công nghệ Thông tin',
    academicYear: profile?.startYear ? `${new Date().getFullYear() - profile.startYear + 1}` : '3',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'Pham Van Mot')}&background=9d7443&color=fff&size=80`,
  };

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
        <SecuritySettings />
        <ContactInfo student={student} />
      </div>
    </div>
  );
}