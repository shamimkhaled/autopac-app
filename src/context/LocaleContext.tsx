'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, Locale } from '@/data/translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Restore persisted language on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('autopac_locale') as Locale;
      if (saved === 'en' || saved === 'bn') {
        setLocaleState(saved);
        document.documentElement.lang = saved === 'bn' ? 'bn' : 'en';
      }
    } catch {
      // localStorage may be blocked in some environments — fail silently
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem('autopac_locale', l);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      document.documentElement.lang = l === 'bn' ? 'bn' : 'en';
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let value: unknown = translations[locale];
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      return typeof value === 'string' ? value : key;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
