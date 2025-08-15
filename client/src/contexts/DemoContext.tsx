import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEMO_STORY, DemoStoryEvent } from '../../../shared/demo-data';

interface DemoContextType {
  isDemoMode: boolean;
  isReadOnly: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  enableReadOnlyMode: () => void;
  currentStoryEvent: DemoStoryEvent | null;
  storyProgress: number;
  isStoryPlaying: boolean;
  startStory: () => void;
  resetStory: () => void;
  stopStory: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function useDemoMode() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
}

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [currentStoryEvent, setCurrentStoryEvent] = useState<DemoStoryEvent | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const [storyTimer, setStoryTimer] = useState<NodeJS.Timeout | null>(null);

  // Check URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    const shareParam = urlParams.get('share');
    
    if (demoParam === '1' || demoParam === 'true') {
      setIsDemoMode(true);
    }
    
    if (shareParam === 'demo') {
      setIsDemoMode(true);
      setIsReadOnly(true);
    }
  }, []);

  // Update URL when demo mode changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (isDemoMode && !isReadOnly) {
      url.searchParams.set('demo', '1');
    } else if (isReadOnly) {
      url.searchParams.set('share', 'demo');
      url.searchParams.delete('demo');
    } else {
      url.searchParams.delete('demo');
      url.searchParams.delete('share');
    }
    window.history.replaceState({}, '', url.toString());
  }, [isDemoMode, isReadOnly]);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setIsReadOnly(false);
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setIsReadOnly(false);
    stopStory();
  };

  const enableReadOnlyMode = () => {
    setIsDemoMode(true);
    setIsReadOnly(true);
  };

  const startStory = () => {
    if (isStoryPlaying) return;
    
    setIsStoryPlaying(true);
    setStoryProgress(0);
    setCurrentStoryEvent(null);
    
    let currentTime = 0;
    let eventIndex = 0;
    
    const tick = () => {
      currentTime += 1;
      setStoryProgress(Math.min((currentTime / 90) * 100, 100));
      
      // Check if we should trigger the next event
      if (eventIndex < DEMO_STORY.length && currentTime >= DEMO_STORY[eventIndex].timestamp) {
        setCurrentStoryEvent(DEMO_STORY[eventIndex]);
        eventIndex++;
      }
      
      if (currentTime < 90) {
        const timer = setTimeout(tick, 1000);
        setStoryTimer(timer);
      } else {
        setIsStoryPlaying(false);
        setStoryTimer(null);
      }
    };
    
    tick();
  };

  const resetStory = () => {
    stopStory();
    setStoryProgress(0);
    setCurrentStoryEvent(null);
  };

  const stopStory = () => {
    if (storyTimer) {
      clearTimeout(storyTimer);
      setStoryTimer(null);
    }
    setIsStoryPlaying(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (storyTimer) {
        clearTimeout(storyTimer);
      }
    };
  }, [storyTimer]);

  const value: DemoContextType = {
    isDemoMode,
    isReadOnly,
    enableDemoMode,
    disableDemoMode,
    enableReadOnlyMode,
    currentStoryEvent,
    storyProgress,
    isStoryPlaying,
    startStory,
    resetStory,
    stopStory,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}