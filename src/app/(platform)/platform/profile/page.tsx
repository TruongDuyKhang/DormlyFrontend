// app/(platform)/platform/profile/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProfileHeader } from './_components/ProfileHeader';
import { ProfileTabs, TabType } from './_components/ProfileTabs';
import { ProfileInfoTab } from './_components/ProfileInfoTab';
import { SecurityTab } from './_components/SecurityTab';
import { ActivityTab } from './_components/ActivityTab';
import { UserProfile } from './_components/types';
import { tokenService, decodeJWT } from '@/services/tokenService';
import { userService } from '@/services/userService';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: 'Administrator',
    email: 'admin@dormly.com',
    phone: '0901234567',
    location: 'Hồ Chí Minh, Việt Nam',
    role: 'System Administrator',
    joinDate: 'Tháng 8, 2026',
    bio: 'Ban Quản trị Hệ thống Ký túc xá Sinh viên Dormly.',
    avatar: '',
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = tokenService.getAccessToken();
      const decoded = token ? decodeJWT(token) : null;
      const stored = localStorage.getItem('session.user') || localStorage.getItem('user');
      const sessionObj = stored ? JSON.parse(stored) : null;

      let userData: any = null;
      try {
        userData = await userService.getMe();
      } catch {
        let userId = sessionObj?.id || decoded?.id;
        if (userId) {
          try {
            userData = await userService.getById(userId);
          } catch {
            // Fallback to session data
          }
        }
      }

      const userId = userData?.id || sessionObj?.id || decoded?.id || '';
      const name = userData?.fullName || sessionObj?.fullName || decoded?.fullname || 'Administrator';
      const email = userData?.email || sessionObj?.email || decoded?.email || 'admin@dormly.com';
      const phone = userData?.phoneNumber || sessionObj?.phoneNumber || '0901234567';
      const avatar = userData?.avatar || sessionObj?.avatar || '';
      
      const rolesArray = userData?.roles || sessionObj?.roles || decoded?.roles;
      let fullRoleStr = 'Administrator';
      if (Array.isArray(rolesArray) && rolesArray.length > 0) {
        fullRoleStr = rolesArray
          .map((r: any) => {
            const raw = typeof r === 'string' ? r : (r.name || String(r));
            const cleaned = raw.replace(/^ROLE_/, '');
            return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
          })
          .join(', ');
      }

      const createdAt = userData?.createdAt || sessionObj?.createdAt;
      const joinDate = createdAt
        ? new Date(createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
        : 'Tháng 8, 2026';

      setProfile({
        id: userId,
        name,
        email,
        phone,
        location: 'Hồ Chí Minh, Việt Nam',
        role: fullRoleStr,
        joinDate,
        bio: 'Ban Quản trị Hệ thống Ký túc xá Sinh viên Dormly.',
        avatar,
        gender: userData?.gender || sessionObj?.gender,
        dateOfBirth: userData?.dateOfBirth || sessionObj?.dateOfBirth,
      });
    } catch (e) {
      console.warn('Failed to load admin profile:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    try {
      const stored = localStorage.getItem('session.user') || localStorage.getItem('user');
      const sessionObj = stored ? JSON.parse(stored) : {};
      const userId = profile.id || sessionObj.id;

      if (userId) {
        await userService.update(userId, {
          email: updatedProfile.email,
          fullName: updatedProfile.name,
          phoneNumber: updatedProfile.phone,
          avatar: updatedProfile.avatar,
        } as any);
      }

      const updated = {
        ...sessionObj,
        fullName: updatedProfile.name,
        phoneNumber: updatedProfile.phone,
        avatar: updatedProfile.avatar,
      };
      localStorage.setItem('session.user', JSON.stringify(updated));
      setFeedbackMessage({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (err: any) {
      console.warn('Could not update admin user:', err);
      setFeedbackMessage({ 
        type: 'error', 
        text: err?.response?.data?.message || 'Không thể lưu thay đổi trên máy chủ. Đã cập nhật tạm thời.' 
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        {/* Header */}
        <ProfileHeader />

        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 flex items-center gap-2 rounded-xl p-3.5 text-sm font-medium ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-800'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-stone-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Đang tải thông tin tài khoản...</span>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'info' && (
              <ProfileInfoTab profile={profile} onUpdate={handleUpdateProfile} />
            )}
            {activeTab === 'security' && <SecurityTab userId={profile.id} userEmail={profile.email} />}
            {activeTab === 'activity' && <ActivityTab userId={profile.id} />}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}