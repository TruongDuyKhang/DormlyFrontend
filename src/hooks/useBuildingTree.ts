'use client';

import { useState, useEffect, useCallback } from 'react';
import { buildingService } from '@/services/buildingService';
import type { BuildingNodeResponseDto, NodeTypeResponseDto } from '@/types/models';

export function useBuildingTree(rootLevel: number = 0) {
  const [tree, setTree] = useState<BuildingNodeResponseDto[]>([]);
  const [nodeTypes, setNodeTypes] = useState<NodeTypeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [treeData, typesData] = await Promise.allSettled([
        buildingService.getNodeTreeByLevel(rootLevel),
        buildingService.listNodeTypes(),
      ]);

      if (treeData.status === 'fulfilled') {
        setTree(treeData.value || []);
      }
      if (typesData.status === 'fulfilled') {
        setNodeTypes(typesData.value || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load building structure');
    } finally {
      setIsLoading(false);
    }
  }, [rootLevel]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  return {
    tree,
    nodeTypes,
    isLoading,
    error,
    refetch: fetchTree,
  };
}
