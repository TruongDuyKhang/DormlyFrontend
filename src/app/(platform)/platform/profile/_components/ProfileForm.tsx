// app/(platform)/platform/profile/_components/ProfileForm.tsx
'use client';

import { User, Mail, Phone, MapPin, Shield, Calendar, FileText } from 'lucide-react';
import { UserProfile } from './types';
import { cn } from '@/lib/utils';

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
}

const fieldConfig = [
  { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
  { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'your@email.com' },
  { key: 'phone', label: 'Phone', icon: Phone, type: 'tel', placeholder: '+1 (555) 123-4567' },
  { key: 'location', label: 'Location', icon: MapPin, type: 'text', placeholder: 'City, Country' },
  { key: 'role', label: 'Role', icon: Shield, type: 'text', placeholder: 'Your role', readOnly: true },
  { key: 'joinDate', label: 'Joined', icon: Calendar, type: 'text', placeholder: 'Join date', readOnly: true },
  { key: 'bio', label: 'Bio', icon: FileText, type: 'textarea', placeholder: 'Tell us about yourself' },
];

export function ProfileForm({ profile, isEditing, onChange }: ProfileFormProps) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">Personal Information</h3>

      <div className="space-y-4">
        {fieldConfig.map((field) => {
          const Icon = field.icon;
          const value = profile[field.key as keyof UserProfile] as string;
          const isReadOnly = field.readOnly || !isEditing;

          if (field.type === 'textarea') {
            return (
              <div key={field.key} className="grid grid-cols-[140px_1fr] gap-4">
                <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {field.label}
                </label>
                {isEditing ? (
                  <textarea
                    value={value}
                    onChange={(e) => onChange(field.key as keyof UserProfile, e.target.value)}
                    rows={3}
                    placeholder={field.placeholder}
                    className="rounded-lg border border-stone-200 bg-white/80 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
                  />
                ) : (
                  <p className="text-sm text-stone-700 leading-relaxed">{value || '—'}</p>
                )}
              </div>
            );
          }

          return (
            <div key={field.key} className="grid grid-cols-[140px_1fr] gap-4">
              <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {field.label}
              </label>
              {isEditing && !isReadOnly ? (
                <input
                  type={field.type}
                  value={value}
                  onChange={(e) => onChange(field.key as keyof UserProfile, e.target.value)}
                  placeholder={field.placeholder}
                  className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                />
              ) : (
                <p className="text-sm text-stone-700">{value || '—'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}