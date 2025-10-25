import React from 'react';
import { useDemoMode } from '@/contexts/DemoContext';
import AutomationsDemo from './AutomationsDemo';
import LegacyBots from './LegacyBots';

export default function Bots() {
  const { isDemoMode } = useDemoMode();

  if (isDemoMode) {
    return <AutomationsDemo />;
  }

  return <LegacyBots />;
}
