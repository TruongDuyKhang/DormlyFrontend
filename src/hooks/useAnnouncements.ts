'use client';

import { useState, useEffect, useCallback } from 'react';
import { announcementService } from '@/services/announcementService';
import type { AnnouncementResponseDto } from '@/types/models';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    isLoading,
    error,
    refetch: fetchAnnouncements,
  };
}
