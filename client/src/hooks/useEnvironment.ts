import { useState, useEffect } from 'react';

export type Environment = 'Paper' | 'Live';

const STORAGE_KEY = 'rugira-environment';

export function useEnvironment() {
  const [environment, setEnvironment] = useState<Environment>(() => {
    // Try to load from localStorage on initial load
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'Live' || stored === 'Paper') {
        return stored as Environment;
      }
    }
    return 'Paper'; // Default to Paper for safety
  });

  // Persist environment changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, environment);
    }
  }, [environment]);

  const switchEnvironment = (newEnv: Environment) => {
    setEnvironment(newEnv);
  };

  const resetToDefault = () => {
    setEnvironment('Paper');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    environment,
    switchEnvironment,
    resetToDefault,
    isLive: environment === 'Live',
    isPaper: environment === 'Paper'
  };
}