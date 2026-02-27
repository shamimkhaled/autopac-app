'use client';

import { SessionProvider } from 'next-auth/react';
import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
