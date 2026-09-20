'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_BRAND_THEME,
  brandThemeToCssVars,
  type BrandTheme,
} from '@/lib/siteAppearance';

export default function ThemeApplier() {
  const [theme, setTheme] = useState<BrandTheme>(DEFAULT_BRAND_THEME);

  useEffect(() => {
    fetch('/api/appearance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.theme) setTheme({ ...DEFAULT_BRAND_THEME, ...d.theme });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const vars = brandThemeToCssVars(theme);
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.primary);
  }, [theme]);

  return null;
}
