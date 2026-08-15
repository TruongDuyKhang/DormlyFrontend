'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { tokenService, decodeJWT } from '@/services/tokenService';
import type { UserResponseDto, UserRequest } from '@/types/models';

export function useCurrentUser() {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getMe();
      setUser(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load user info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = async (payload: Partial<UserRequest>) => {
    const token = tokenService.getAccessToken();
    const decoded = token ? decodeJWT(token) : null;
    if (!decoded?.id) throw new Error('No authenticated user');

    setIsUpdating(true);
    setError(null);
    try {
      const updated = await userService.update(decoded.id, {
        email: user?.email ?? '',
        fullName: user?.fullName ?? '',
        phoneNumber: user?.phoneNumber,
        dateOfBirth: user?.dateOfBirth,
        gender: user?.gender,
        roles: user?.roles ? [...user.roles] : [],
        avatar: user?.avatar,
        ...payload,
      });
      setUser(updated);
      return updated;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update user';
      setError(message);
      throw new Error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isUpdating,
    error,
    updateUser,
    refetch: fetchUser,
  };
}
