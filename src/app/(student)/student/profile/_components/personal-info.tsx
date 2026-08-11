// app/(student)/profile/_components/personal-info.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Edit2, Save, X, ChevronDown, Check } from "lucide-react";
import type { Student } from "./types";

interface PersonalInfoProps {
  student: Student;
  onUpdate?: (data: Partial<Student>) => void;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export function PersonalInfo({ student, onUpdate }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: student.fullName,
    phoneNumber: student.phoneNumber,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
  });
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData({
      fullName: student.fullName,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
    });
  }, [student]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    onUpdate?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: student.fullName,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
    });
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      default: return 'Other';
    }
  };

  const selectedGenderLabel = genderOptions.find(
    (opt) => opt.value === formData.gender
  )?.label || getGenderLabel(formData.gender);

  return (
    <div className="rounded-xl border-2 border-stone-300/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-stone-900">Personal Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-full bg-emerald-600 p-1.5 text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="rounded-full bg-stone-200 p-1.5 text-stone-600 transition hover:bg-stone-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        // View Mode
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Full Name</p>
            <p className="text-base font-medium text-stone-900">{student.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Student ID</p>
            <p className="text-base font-medium text-stone-900">{student.studentId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">University Email</p>
            <p className="text-base text-stone-800">{student.universityEmail}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Phone Number</p>
            <p className="text-base text-stone-800">{student.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Gender</p>
            <p className="text-base text-stone-800">{getGenderLabel(student.gender)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-500 mb-1">Date of Birth</p>
            <p className="text-base text-stone-800">{formatDate(student.dateOfBirth)}</p>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Gender</label>
            <div className="relative" ref={genderDropdownRef}>
              <button
                type="button"
                onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm text-left flex items-center justify-between focus:border-[#9d7443] focus:outline-none transition bg-white"
              >
                <span className={formData.gender ? "text-stone-900" : "text-stone-400"}>
                  {selectedGenderLabel}
                </span>
                <ChevronDown className={`h-4 w-4 text-stone-400 transition-transform ${isGenderDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isGenderDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border-2 border-stone-200 bg-white shadow-lg overflow-hidden">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, gender: option.value as 'male' | 'female' | 'other' });
                        setIsGenderDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-stone-50 transition"
                    >
                      <span className="text-stone-700">{option.label}</span>
                      {formData.gender === option.value && (
                        <Check className="h-4 w-4 text-[#9d7443]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full rounded-xl border-2 border-stone-200 px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition"
            />
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-stone-400">Note: Student ID and Email cannot be changed. Contact admin for assistance.</p>
          </div>
        </div>
      )}
    </div>
  );
}