'use client';

import { useState, useEffect, useCallback } from 'react';
import { studentProfileService } from '@/services/studentProfileService';
import type { StudentProfileResponseDto, StudentProfileRequest } from '@/types/models';

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentProfileService.getMyProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (payload: StudentProfileRequest) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await studentProfileService.upsertMyProfile(payload);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update profile';
      setError(message);
      throw new Error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
