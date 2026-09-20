'use client';

import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from 'next-themes';
import ThemeApplier from '@/components/ThemeApplier';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LocaleProvider>
        <ThemeApplier />
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
