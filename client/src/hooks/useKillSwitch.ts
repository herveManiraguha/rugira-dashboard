import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { KillSwitchState, KillSwitchEngageRequest, KillSwitchClearRequest } from '@/../../shared/schema';

export function useKillSwitch() {
  const queryClient = useQueryClient();

  // Query kill switch status
  const { data: killSwitchState, isLoading } = useQuery<KillSwitchState | { active: false }>({
    queryKey: ['/api/admin/kill-switch/status'],
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Engage kill switch mutation
  const engageMutation = useMutation({
    mutationFn: async (request: KillSwitchEngageRequest) => {
      const response = await fetch(`/api/admin/kill-switch/engage`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to engage kill switch');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/kill-switch/status'] });
    },
  });

  // Clear kill switch mutation
  const clearMutation = useMutation({
    mutationFn: async (request: KillSwitchClearRequest) => {
      const response = await fetch(`/api/admin/kill-switch/clear`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear kill switch');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/kill-switch/status'] });
    },
  });

  return {
    killSwitchState: killSwitchState?.active ? killSwitchState as KillSwitchState : null,
    isLoading: isLoading || engageMutation.isPending || clearMutation.isPending,
    engageKillSwitch: engageMutation.mutateAsync,
    clearKillSwitch: clearMutation.mutateAsync,
    error: engageMutation.error || clearMutation.error,
  };
}