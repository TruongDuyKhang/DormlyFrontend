// app/(student)/profile/_components/profile-header.tsx
"use client";

import { Camera } from "lucide-react";
import type { Student } from "./types";

interface ProfileHeaderProps {
  student: Student;
}

export function ProfileHeader({ student }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2f2a24] text-2xl font-semibold text-[#d6bd8a]">
            {student.avatar ? (
              <img src={student.avatar} alt={student.fullName} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              student.fullName.charAt(0)
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-md hover:bg-stone-100 transition">
            <Camera className="h-3.5 w-3.5 text-stone-600" />
          </button>
        </div>

        {/* Name & Info */}
        <div>
          <h2 className="text-2xl font-semibold text-stone-900">{student.fullName}</h2>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-stone-500">
            <span>{student.studentId}</span>
            <span className="text-stone-300">•</span>
            <span>{student.major}</span>
          </div>
        </div>
      </div>
    </div>
  );
}