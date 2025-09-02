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
    
    // Handle SSE connections based on environment
    if (environment === 'Demo') {
      console.log('Demo mode: SSE disabled');
      sseClient.disconnect();
    } else {
      // Connect SSE for Paper/Live modes
      console.log(`${environment} mode: SSE enabled`);
      sseClient.connect();
    }

    // Cleanup on unmount or environment change
    return () => {
      sseClient.disconnect();
    };
  }, [environment]);

  return apiClient;
}