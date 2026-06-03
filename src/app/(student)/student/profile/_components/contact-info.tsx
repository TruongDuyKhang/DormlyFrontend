// app/(student)/profile/_components/contact-info.tsx
"use client";

import { useState } from "react";
import { Mail, Phone, Edit2, Save, X, CheckCircle } from "lucide-react";
import type { Student } from "./types";

interface ContactInfoProps {
  student: Student;
  onUpdateEmail?: (email: string) => void;
  onUpdatePhone?: (phone: string) => void;
}

export function ContactInfo({ student, onUpdateEmail, onUpdatePhone }: ContactInfoProps) {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newEmail, setNewEmail] = useState(student.universityEmail);
  const [newPhone, setNewPhone] = useState(student.phoneNumber);
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(true);

  const handleSaveEmail = () => {
    onUpdateEmail?.(newEmail);
    setIsEditingEmail(false);
  };

  const handleSavePhone = () => {
    onUpdatePhone?.(newPhone);
    setIsEditingPhone(false);
  };

  return (
    <div className="rounded-xl border-2 border-stone-300/80 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-stone-900 mb-4">Contact Information</h3>

      <div className="space-y-3">
        {/* Email Section */}
        <div className="rounded-xl border border-stone-200 p-4 transition hover:border-[#9d7443]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
                <Mail className="h-4 w-4 text-stone-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-stone-900">Email Address</p>
                  {emailVerified && (
                    <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {!isEditingEmail ? (
                  <p className="mt-0.5 text-sm text-stone-600">{student.universityEmail}</p>
                ) : (
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-[#9d7443] focus:outline-none"
                    placeholder="Enter new email"
                  />
                )}
              </div>
            </div>
            {!isEditingEmail ? (
              <button
                onClick={() => setIsEditingEmail(true)}
                className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEmail}
                  className="rounded-full bg-emerald-600 p-1.5 text-white transition hover:bg-emerald-700"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingEmail(false);
                    setNewEmail(student.universityEmail);
                  }}
                  className="rounded-full bg-stone-200 p-1.5 text-stone-600 transition hover:bg-stone-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Phone Section */}
        <div className="rounded-xl border border-stone-200 p-4 transition hover:border-[#9d7443]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
                <Phone className="h-4 w-4 text-stone-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-stone-900">Phone Number</p>
                  {phoneVerified && (
                    <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {!isEditingPhone ? (
                  <p className="mt-0.5 text-sm text-stone-600">{student.phoneNumber}</p>
                ) : (
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border-2 border-stone-200 px-3 py-1.5 text-sm focus:border-[#9d7443] focus:outline-none"
                    placeholder="+84 XXX XXX XXX"
                  />
                )}
              </div>
            </div>
            {!isEditingPhone ? (
              <button
                onClick={() => setIsEditingPhone(true)}
                className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSavePhone}
                  className="rounded-full bg-emerald-600 p-1.5 text-white transition hover:bg-emerald-700"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingPhone(false);
                    setNewPhone(student.phoneNumber);
                  }}
                  className="rounded-full bg-stone-200 p-1.5 text-stone-600 transition hover:bg-stone-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}