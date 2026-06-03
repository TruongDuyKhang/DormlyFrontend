// app/(student)/profile/account/page.tsx
"use client";

import { ProfileTabs } from "../_components/profile-tabs";
import { ProfileHeader } from "../_components/profile-header";
import { PersonalInfo } from "../_components/personal-info";
import { AcademicInfo } from "../_components/academic-info";
import { EmergencyContact } from "../_components/emergency-contact";
import type { Student, EmergencyContact as EmergencyContactType } from "../_components/types";

// Mock data - sẽ thay bằng API sau
const mockStudent: Student = {
  id: "1",
  fullName: "Truong Duy Khang",
  studentId: "STU2024001",
  universityEmail: "khang.truong@student.edu.vn",
  phoneNumber: "+84 901 234 567",
  gender: "male",
  dateOfBirth: "2002-05-15",
  faculty: "Engineering",
  major: "Software Engineering",
  academicYear: "3",
  avatar: "https://ui-avatars.com/api/?name=Truong+Duy+Khang&background=9d7443&color=fff&size=80",
};

const mockEmergencyContact: EmergencyContactType = {
  name: "Nguyen Van A",
  phoneNumber: "+84 902 345 678",
  relationship: "Parent",
};

export default function AccountPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            My Profile
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Account
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Manage your personal information and academic details
          </p>
        </div>
        <ProfileTabs />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <ProfileHeader student={mockStudent} />
        <PersonalInfo student={mockStudent} />
        <AcademicInfo student={mockStudent} />
        <EmergencyContact contact={mockEmergencyContact} />
      </div>
    </div>
  );
}