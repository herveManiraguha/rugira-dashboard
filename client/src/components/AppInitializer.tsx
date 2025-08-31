import { useEffect } from 'react';
import { useApiClient } from '@/hooks/useApiClient';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  // Initialize API client with environment
  useApiClient();
  
  return <>{children}</>;
}