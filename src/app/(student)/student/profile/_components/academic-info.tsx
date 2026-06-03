// app/(student)/profile/_components/academic-info.tsx
"use client";

import { GraduationCap, Lock, CheckCircle } from "lucide-react";
import type { Student } from "./types";

interface AcademicInfoProps {
  student: Student;
}

export function AcademicInfo({ student }: AcademicInfoProps) {
  const getAcademicYearLabel = (year: string) => {
    switch (year) {
      case '1': return '1st Year';
      case '2': return '2nd Year';
      case '3': return '3rd Year';
      case '4': return '4th Year';
      case '5': return '5th Year';
      default: return `${year}th Year`;
    }
  };

  return (
    <div className="rounded-xl border-2 border-stone-300/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#9d7443]" />
          <h3 className="text-lg font-bold text-stone-900">Academic Information</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">Verified by Admin</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-stone-500 mb-1">Faculty</p>
          <p className="text-base font-medium text-stone-900">{student.faculty}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-500 mb-1">Major / Program</p>
          <p className="text-base font-medium text-stone-900">{student.major}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-500 mb-1">Academic Year</p>
          <p className="text-base font-medium text-stone-900">{getAcademicYearLabel(student.academicYear)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-500 mb-1">Student Status</p>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white shadow-sm">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-stone-50 p-4">
        <p className="text-xs text-stone-500">
          Academic information is synchronized with the university system. For corrections, please contact the Academic Office.
        </p>
      </div>
    </div>
  );
}