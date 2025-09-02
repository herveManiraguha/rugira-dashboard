import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TradingEnvironment = 'Demo' | 'Paper' | 'Live';

interface EnvironmentContextType {
  environment: TradingEnvironment;
  setEnvironment: (env: TradingEnvironment) => void;
  isDemo: boolean;
  isPaper: boolean;
  isLive: boolean;
  apiBaseUrl: string;
}

const EnvironmentContext = createContext<EnvironmentContextType | null>(null);

interface EnvironmentProviderProps {
  children: ReactNode;
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
  // Default to Demo mode
  const [environment, setEnvironmentState] = useState<TradingEnvironment>('Demo');

  // Determine API base URL based on environment
  const getApiBaseUrl = (env: TradingEnvironment): string => {
    if (env === 'Demo') {
      // Demo mode uses local mock endpoints
      return '';
    }
    // Paper and Live modes use real API
    // In production, this will be https://app.rugira.ch/api
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return baseUrl;
  };

  const setEnvironment = (env: TradingEnvironment) => {
    setEnvironmentState(env);
    // Store in session for persistence during the session
    sessionStorage.setItem('rugira_environment', env);
  };

  useEffect(() => {
    // Check for stored environment preference (session only, not persistent)
    const stored = sessionStorage.getItem('rugira_environment') as TradingEnvironment;
    if (stored && ['Demo', 'Paper', 'Live'].includes(stored)) {
      setEnvironmentState(stored);
      console.log(`Environment restored: ${stored} mode`);
    } else {
      // Default to Demo mode
      setEnvironmentState('Demo');
      console.log('Environment initialized: Demo mode (default)');
    }
  }, []);

  const contextValue: EnvironmentContextType = {
    environment,
    setEnvironment,
    isDemo: environment === 'Demo',
    isPaper: environment === 'Paper',
    isLive: environment === 'Live',
    apiBaseUrl: getApiBaseUrl(environment)
  };

  return (
    <EnvironmentContext.Provider value={contextValue}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider');
  }
  return context;
}