// app/(platform)/platform/profile/_components/ProfileInfoTab.tsx
'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, FileText, Edit2, Save, X } from 'lucide-react';
import { UserProfile } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar';
import { Button } from '@/_components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileInfoTabProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export function ProfileInfoTab({ profile, onUpdate }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const infoFields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email' },
    { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
  ];

  const readonlyFields = [
    { key: 'role', label: 'Role', icon: Shield, value: profile.role },
    { key: 'joinDate', label: 'Joined', icon: Calendar, value: profile.joinDate },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Avatar Section */}
      <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-6 text-center">
        <div className="relative inline-block">
          <Avatar className="h-28 w-28 mx-auto">
            <AvatarImage src={formData.avatar} alt={formData.name} />
            <AvatarFallback className="bg-stone-800 text-2xl font-bold text-stone-100">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-[#c3a26c] p-1.5 text-white hover:bg-[#b08f5a] transition">
              <Edit2 className="h-3 w-3" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          )}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-stone-800">{formData.name}</h3>
        <p className="text-sm text-stone-500">{formData.role}</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-stone-500">Active</span>
        </div>
      </div>

      {/* Info Form */}
      <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-800">Personal Information</h3>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              className="h-8 gap-1 text-[#c3a26c] hover:text-[#b08f5a] hover:bg-[#c3a26c]/10"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="h-8 gap-1 text-stone-500 hover:text-stone-700"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="h-8 gap-1 bg-[#c3a26c] text-white hover:bg-[#b08f5a]"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {infoFields.map((field) => {
            const Icon = field.icon;
            const value = formData[field.key as keyof UserProfile] as string;
            return (
              <div key={field.key} className="grid grid-cols-[120px_1fr] gap-4">
                <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {field.label}
                </label>
                {isEditing ? (
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                  />
                ) : (
                  <p className="text-sm text-stone-700">{value}</p>
                )}
              </div>
            );
          })}

          {readonlyFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="grid grid-cols-[120px_1fr] gap-4">
                <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {field.label}
                </label>
                <p className="text-sm text-stone-700">{field.value}</p>
              </div>
            );
          })}

          <div className="grid grid-cols-[120px_1fr] gap-4">
            <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
              />
            ) : (
              <p className="text-sm text-stone-700 leading-relaxed">{formData.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}