// app/(student)/profile/settings/page.tsx
"use client";

import { ProfileTabs } from "../_components/profile-tabs";
import { SecuritySettings } from "../_components/security-settings";
import { ContactInfo } from "../_components/contact-info";
import type { Student } from "../_components/types";

// Mock data - sẽ thay bằng API sau
const mockStudent: Student = {
  id: "1",
  fullName: "Nguyen Minh Anh",
  studentId: "STU2024001",
  universityEmail: "minh.nguyen@student.edu.vn",
  phoneNumber: "+84 901 234 567",
  gender: "male",
  dateOfBirth: "2002-05-15",
  faculty: "Engineering",
  major: "Software Engineering",
  academicYear: "3",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            My Profile
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Manage your account security and contact preferences
          </p>
        </div>
        <ProfileTabs />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <SecuritySettings />
        <ContactInfo student={mockStudent} />
      </div>
    </div>
  );
}