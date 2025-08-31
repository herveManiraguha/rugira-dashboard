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
    
    // Connect SSE for Paper/Live modes
    if (environment !== 'Demo') {
      sseClient.connect();
    } else {
      // Disconnect SSE in Demo mode
      sseClient.disconnect();
    }

    // Cleanup on unmount or environment change
    return () => {
      if (environment !== 'Demo') {
        sseClient.disconnect();
      }
    };
  }, [environment]);

  return apiClient;
}