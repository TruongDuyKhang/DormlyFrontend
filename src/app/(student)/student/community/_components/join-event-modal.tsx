// app/(student)/community/_components/join-event-modal.tsx
"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface JoinFormData {
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
}

interface JoinEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: JoinFormData) => void;
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    currentParticipants: number;
    maxParticipants: number;
  };
}

export function JoinEventModal({ isOpen, onClose, onConfirm, event }: JoinEventModalProps) {
  const [formData, setFormData] = useState<JoinFormData>({
    fullName: "",
    studentId: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<JoinFormData>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<JoinFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (10-11 digits)";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(formData);
      setFormData({ fullName: "", studentId: "", phone: "", email: "" });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ fullName: "", studentId: "", phone: "", email: "" });
    setErrors({});
    onClose();
  };

  const remainingSpots = event.maxParticipants - event.currentParticipants;
  const isAlmostFull = remainingSpots <= 5 && remainingSpots > 0;
  const isFull = remainingSpots <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white p-5 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">Join Event</h2>
            <p className="mt-0.5 text-sm text-stone-500">Fill in your information to register</p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-100 transition"
          >
            <X className="h-4 w-4 text-stone-500" />
          </button>
        </div>

        {/* Layout 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column - Event Info */}
          <div className="border-r border-stone-100 bg-stone-50/50 p-6">
            <div className="space-y-5">
              <h3 className="text-xl font-semibold text-stone-900">{event.title}</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-baseline gap-3">
                  <span className="w-20 text-stone-500">Date</span>
                  <span className="text-stone-800">{event.date}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-20 text-stone-500">Time</span>
                  <span className="text-stone-800">{event.time}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-20 text-stone-500">Location</span>
                  <span className="text-stone-800">{event.location}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-20 text-stone-500">Participants</span>
                  <span className="text-stone-800">
                    {event.currentParticipants} / {event.maxParticipants}
                  </span>
                </div>
              </div>

              {/* Spots left warning */}
              {isAlmostFull && !isFull && (
                <div className="mt-4 rounded-xl bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-800">
                    Only {remainingSpots} spot{remainingSpots > 1 ? 's' : ''} left!
                  </p>
                  <p className="text-xs text-amber-700 mt-1">Register soon to secure your spot.</p>
                </div>
              )}

              {isFull && (
                <div className="mt-4 rounded-xl bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">Event is full</p>
                  <p className="text-xs text-red-700 mt-1">Please check other upcoming events.</p>
                </div>
              )}

              {/* Info box - chỉ text, không icon */}
              <div className="mt-6 rounded-xl bg-stone-100 p-4 text-center">
                <p className="text-sm font-medium text-stone-700">Don't miss out!</p>
                <p className="text-xs text-stone-500 mt-1">Join and connect with your community</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full rounded-xl border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-stone-200'} px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition`}
                  placeholder="Nguyen Van A"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className={`w-full rounded-xl border ${errors.studentId ? 'border-red-300 bg-red-50' : 'border-stone-200'} px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition`}
                  placeholder="20240001"
                />
                {errors.studentId && (
                  <p className="mt-1 text-xs text-red-500">{errors.studentId}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-stone-200'} px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition`}
                  placeholder="0901234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-stone-400">We'll send SMS reminders before the event</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Email <span className="text-stone-400 text-xs">(optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-stone-200'} px-4 py-2.5 text-sm focus:border-[#9d7443] focus:outline-none transition`}
                  placeholder="student@university.edu.vn"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-stone-400">Receive event updates and reminders</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFull}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium text-white transition active:scale-[0.98] ${
                    isFull
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-[#2f2a24] hover:bg-[#40382f]'
                  }`}
                >
                  {isFull ? 'Event Full' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}