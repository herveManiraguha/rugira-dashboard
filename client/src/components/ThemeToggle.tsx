import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-hover-surface transition-all duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      data-testid="theme-toggle"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-text-secondary transition-transform hover:text-text-body" />
      ) : (
        <Sun className="h-4 w-4 text-text-secondary transition-transform hover:text-text-body" />
      )}
    </button>
  );
}