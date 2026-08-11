'use client';

import { useState, useEffect, useCallback } from 'react';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import type { CurrentRoomResponseDto, RoomHistoryResponseDto } from '@/types/models';

export function useCurrentRoom() {
  const [currentRoom, setCurrentRoom] = useState<CurrentRoomResponseDto | null>(null);
  const [history, setHistory] = useState<RoomHistoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roomData, historyData] = await Promise.allSettled([
        roomAssignmentService.getCurrentRoom(),
        roomAssignmentService.getRoomHistory(),
      ]);

      if (roomData.status === 'fulfilled') {
        setCurrentRoom(roomData.value);
      }
      if (historyData.status === 'fulfilled') {
        setHistory(historyData.value || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch room information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  return {
    currentRoom,
    history,
    isLoading,
    error,
    refetch: fetchRoomData,
  };
}
