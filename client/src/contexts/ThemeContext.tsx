import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  getNextTheme: () => Theme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Theme cycle order: Light → High-Contrast → Dark → Light
  const themeOrder: Theme[] = ['light', 'high-contrast', 'dark'];

  const getNextTheme = (): Theme => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Apply theme class to document root
    document.documentElement.className = document.documentElement.className
      .replace(/theme-(light|dark|high-contrast)/g, '')
      .trim();
    document.documentElement.classList.add(`theme-${newTheme}`);
    
    // Persist theme choice
    localStorage.setItem('rugira-theme', newTheme);
  };

  const cycleTheme = () => {
    const nextTheme = getNextTheme();
    setTheme(nextTheme);
  };

  // Detect OS preference and initialize theme
  const detectInitialTheme = (): Theme => {
    // Check for saved preference first
    const savedTheme = localStorage.getItem('rugira-theme') as Theme;
    if (savedTheme && themeOrder.includes(savedTheme)) {
      return savedTheme;
    }

    // Check OS preferences
    if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
      return 'high-contrast';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  };

  useEffect(() => {
    const initialTheme = detectInitialTheme();
    setTheme(initialTheme);
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    cycleTheme,
    getNextTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}