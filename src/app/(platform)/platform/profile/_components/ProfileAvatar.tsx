// app/(platform)/platform/profile/_components/ProfileAvatar.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/_components/ui/avatar';
import { Button } from '@/_components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  name: string;
  avatar?: string;
  isEditing: boolean;
  onAvatarChange?: (file: File) => void;
}

export function ProfileAvatar({ name, avatar, isEditing, onAvatarChange }: ProfileAvatarProps) {
  const [isHovering, setIsHovering] = useState(false);

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-6 text-center">
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar className="h-32 w-32 mx-auto">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-stone-800 text-3xl font-bold text-stone-100">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <label
            className={cn(
              "absolute bottom-2 right-2 cursor-pointer rounded-full bg-[#c3a26c] p-2 text-white transition-all",
              isHovering ? "opacity-100" : "opacity-80",
              "hover:bg-[#b08f5a]"
            )}
          >
            <Camera className="h-3.5 w-3.5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      <h2 className="mt-4 text-xl font-bold text-stone-800">{name}</h2>
      <p className="text-sm text-stone-500">System Administrator</p>
      <div className="mt-4 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}