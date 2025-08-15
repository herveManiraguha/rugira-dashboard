import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useDemoMode } from '@/contexts/DemoContext';
import Overview from './Overview';

export default function DemoOverview() {
  const [, setLocation] = useLocation();
  const { enableReadOnlyMode, isDemoMode } = useDemoMode();

  useEffect(() => {
    // Enable read-only demo mode when accessing this route
    enableReadOnlyMode();
  }, [enableReadOnlyMode]);

  // If not in demo mode yet, redirect to enable demo
  useEffect(() => {
    if (!isDemoMode) {
      setLocation('/overview?share=demo');
    }
  }, [isDemoMode, setLocation]);

  return <Overview />;
}