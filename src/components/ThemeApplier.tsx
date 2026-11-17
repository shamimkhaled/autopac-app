'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_BRAND_THEME,
  DEFAULT_PWA_CONFIG,
  brandThemeToCssVars,
  type BrandTheme,
  type PwaConfig,
} from '@/lib/siteAppearance';

export default function ThemeApplier() {
  const [theme, setTheme] = useState<BrandTheme>(DEFAULT_BRAND_THEME);
  const [pwaFlags, setPwaFlags] = useState<Partial<PwaConfig>>(DEFAULT_PWA_CONFIG);

  useEffect(() => {
    fetch('/api/appearance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.theme) setTheme({ ...DEFAULT_BRAND_THEME, ...d.theme });
        if (d?.pwa) setPwaFlags({ ...DEFAULT_PWA_CONFIG, ...d.pwa });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const vars = brandThemeToCssVars(theme);
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-radius', theme.borderRadius || 'standard');
    root.setAttribute('data-card-style', theme.cardStyle || 'hairline');
    root.setAttribute('data-density', theme.sectionDensity || 'standard');
    root.setAttribute('data-header-sticky', theme.headerSticky === false ? 'false' : 'true');

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', pwaFlags.themeColor || theme.primary);
  }, [theme, pwaFlags]);

  return null;
}
