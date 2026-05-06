'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-400 hover:text-accent-cyan hover:bg-surface-100/50 dark:hover:bg-surface-100/50 transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
