'use client';

import { SessionProvider } from 'next-auth/react';
import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from 'next-themes';
import ThemeApplier from '@/components/ThemeApplier';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LocaleProvider>
          <ThemeApplier />
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
