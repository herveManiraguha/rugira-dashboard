import { useEffect } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import apiClient from '@/lib/apiClient';
import sseClient from '@/lib/sseClient';

export function useApiClient() {
  const { environment } = useEnvironment();

  useEffect(() => {
    // Update API client environment when context changes
    apiClient.setEnvironment(environment);
    
    // Update SSE client environment
    sseClient.setEnvironment(environment);
    
    // Always disconnect SSE in Demo mode to prevent connection attempts
    if (environment === 'Demo') {
      console.log('Demo mode: SSE disabled');
      sseClient.disconnect();
    } else {
      // Only connect SSE for Paper/Live modes
      console.log(`${environment} mode: connecting SSE client`);
      sseClient.connect();
    }

    // Cleanup on unmount or environment change
    return () => {
      sseClient.disconnect();
    };
  }, [environment]);

  return apiClient;
}