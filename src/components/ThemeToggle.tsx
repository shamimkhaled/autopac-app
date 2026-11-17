'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-md border border-stone-200 dark:border-stone-700 bg-brand-paper dark:bg-stone-900 shrink-0"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-brand-maroon text-stone-700 dark:text-stone-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-stone-700" aria-hidden="true" />
      )}
    </button>
  );
}
