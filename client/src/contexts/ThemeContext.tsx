import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const THEME_STORAGE_KEY = 'rugira-theme-preference';

const detectOSPreference = (): Theme => {
  // Check for high contrast preference first
  if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
    return 'high-contrast';
  }
  
  // Check for dark mode preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // First check localStorage for saved preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && ['light', 'dark', 'high-contrast'].includes(savedTheme)) {
      return savedTheme as Theme;
    }
    
    // Otherwise detect OS preference
    return detectOSPreference();
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    
    // Update document classes for theme
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(newTheme);
    
    // Update data attribute for CSS
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'high-contrast', 'dark'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for OS preference changes
  useEffect(() => {
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = () => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setThemeState(detectOSPreference());
      }
    };
    
    if (mediaQueryDark.addEventListener) {
      mediaQueryDark.addEventListener('change', handleChange);
      mediaQueryHighContrast.addEventListener('change', handleChange);
      return () => {
        mediaQueryDark.removeEventListener('change', handleChange);
        mediaQueryHighContrast.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};