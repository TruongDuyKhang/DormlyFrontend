// app/(platform)/platform/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProfileHeader } from './_components/ProfileHeader';
import { ProfileTabs, TabType } from './_components/ProfileTabs';
import { ProfileInfoTab } from './_components/ProfileInfoTab';
import { SecurityTab } from './_components/SecurityTab';
import { ActivityTab } from './_components/ActivityTab';
import { UserProfile } from './_components/types';

const defaultProfile: UserProfile = {
  name: 'Ari Renard',
  email: 'ari@dormly.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  role: 'System Administrator',
  joinDate: 'January 15, 2024',
  bio: 'Experienced system administrator with over 8 years in residence management systems.',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const saved = localStorage.getItem('dormly_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('dormly_profile', JSON.stringify(updatedProfile));
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

        {/* Tabs Navigation */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
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
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'activity' && <ActivityTab />}
        </motion.div>
      </div>
    </motion.div>
  );
}