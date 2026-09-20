import { prisma } from '@/lib/prisma';

export const BRAND_THEME_KEY = 'brandTheme';
export const SEO_MARKETING_KEY = 'seoMarketing';

export interface BrandTheme {
  primary: string;
  primaryHover: string;
  primaryMid: string;
  paper: string;
  text: string;
  textMuted: string;
  buttonText: string;
  surface: string;
  accent: string;
  defaultMode: 'light' | 'dark' | 'system';
}

export interface SeoMarketing {
  siteTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  googleSiteVerification: string;
  robotsIndex: boolean;
  schemaDescription: string;
}

export const DEFAULT_BRAND_THEME: BrandTheme = {
  primary: '#6D1A2D',
  primaryHover: '#551624',
  primaryMid: '#8B2E2E',
  paper: '#F7F4EF',
  text: '#1C1917',
  textMuted: '#57534E',
  buttonText: '#FFFFFF',
  surface: '#FFFFFF',
  accent: '#6B21A8',
  defaultMode: 'light',
};

export const DEFAULT_SEO_MARKETING: SeoMarketing = {
  siteTitle: 'Auto Pac – World Class Food Processing & Packaging Machinery Since 1990',
  titleTemplate: '%s | Auto Pac Machinery',
  description:
    'Auto Pac — established 1990, Kawran Bazar, Dhaka. Premier importer, manufacturer & supplier of world-class food processing and packaging machinery in Bangladesh. 500+ machines delivered, 300+ happy clients, 22+ machine categories.',
  keywords:
    'Auto Pac machinery Bangladesh, packaging machine Dhaka, food processing equipment, automatic packing machine, spice packing, bottling machine, detergent packing, liquid filling, industrial automation, Kawran Bazar machinery, since 1990',
  ogTitle: 'Auto Pac – World Class Industrial Machinery Solutions',
  ogDescription:
    'Premier manufacturer and importer of high-performance packaging and processing systems in Bangladesh.',
  ogImageUrl: '/images/og-image.jpg',
  twitterTitle: 'Auto Pac Machinery',
  twitterDescription: 'World-class industrial automation solutions in Bangladesh.',
  googleAnalyticsId: '',
  facebookPixelId: '',
  googleSiteVerification: '',
  robotsIndex: true,
  schemaDescription:
    'Auto Pac — established 1990 — is the premier importer, manufacturer, and supplier of world-class food processing and packaging machinery in Bangladesh, serving 300+ clients across 22+ machine categories.',
};

function isHex(v: unknown): v is string {
  return typeof v === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v.trim());
}

export function mergeBrandTheme(partial?: Partial<BrandTheme> | null): BrandTheme {
  const d = DEFAULT_BRAND_THEME;
  if (!partial) return { ...d };
  return {
    primary: isHex(partial.primary) ? partial.primary : d.primary,
    primaryHover: isHex(partial.primaryHover) ? partial.primaryHover : d.primaryHover,
    primaryMid: isHex(partial.primaryMid) ? partial.primaryMid : d.primaryMid,
    paper: isHex(partial.paper) ? partial.paper : d.paper,
    text: isHex(partial.text) ? partial.text : d.text,
    textMuted: isHex(partial.textMuted) ? partial.textMuted : d.textMuted,
    buttonText: isHex(partial.buttonText) ? partial.buttonText : d.buttonText,
    surface: isHex(partial.surface) ? partial.surface : d.surface,
    accent: isHex(partial.accent) ? partial.accent : d.accent,
    defaultMode:
      partial.defaultMode === 'dark' || partial.defaultMode === 'system' || partial.defaultMode === 'light'
        ? partial.defaultMode
        : d.defaultMode,
  };
}

export function mergeSeoMarketing(partial?: Partial<SeoMarketing> | null): SeoMarketing {
  const d = DEFAULT_SEO_MARKETING;
  if (!partial) return { ...d };
  return {
    siteTitle: partial.siteTitle?.trim() || d.siteTitle,
    titleTemplate: partial.titleTemplate?.trim() || d.titleTemplate,
    description: partial.description?.trim() || d.description,
    keywords: partial.keywords?.trim() || d.keywords,
    ogTitle: partial.ogTitle?.trim() || d.ogTitle,
    ogDescription: partial.ogDescription?.trim() || d.ogDescription,
    ogImageUrl: partial.ogImageUrl?.trim() || d.ogImageUrl,
    twitterTitle: partial.twitterTitle?.trim() || d.twitterTitle,
    twitterDescription: partial.twitterDescription?.trim() || d.twitterDescription,
    googleAnalyticsId: (partial.googleAnalyticsId || '').trim(),
    facebookPixelId: (partial.facebookPixelId || '').trim(),
    googleSiteVerification: (partial.googleSiteVerification || '').trim(),
    robotsIndex: partial.robotsIndex !== false,
    schemaDescription: partial.schemaDescription?.trim() || d.schemaDescription,
  };
}

async function readSetting<T>(key: string, merge: (p: Partial<T> | null) => T): Promise<T> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (!row?.value) return merge(null);
    return merge(JSON.parse(row.value) as Partial<T>);
  } catch {
    return merge(null);
  }
}

async function writeSetting(key: string, value: unknown, description: string) {
  const payload = JSON.stringify(value);
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: payload, description },
    create: { key, value: payload, description },
  });
}

export function getBrandTheme() {
  return readSetting<BrandTheme>(BRAND_THEME_KEY, mergeBrandTheme);
}

export function saveBrandTheme(theme: BrandTheme) {
  return writeSetting(BRAND_THEME_KEY, mergeBrandTheme(theme), 'Public brand colors and appearance');
}

export function getSeoMarketing() {
  return readSetting<SeoMarketing>(SEO_MARKETING_KEY, mergeSeoMarketing);
}

export function saveSeoMarketing(seo: SeoMarketing) {
  return writeSetting(SEO_MARKETING_KEY, mergeSeoMarketing(seo), 'SEO, Open Graph, and marketing pixels');
}

/** Space-separated R G B for Tailwind opacity modifiers (`bg-brand-maroon/10`). */
export function hexToRgbChannels(hex: string): string {
  const h = hex.trim().replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return '109 26 45';
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function brandThemeToCssVars(theme: BrandTheme): Record<string, string> {
  const t = mergeBrandTheme(theme);
  return {
    '--brand-maroon': t.primary,
    '--brand-maroon-rgb': hexToRgbChannels(t.primary),
    '--brand-maroon-hover': t.primaryHover,
    '--brand-maroon-hover-rgb': hexToRgbChannels(t.primaryHover),
    '--brand-maroon-mid': t.primaryMid,
    '--brand-maroon-mid-rgb': hexToRgbChannels(t.primaryMid),
    '--brand-paper': t.paper,
    '--brand-paper-rgb': hexToRgbChannels(t.paper),
    '--brand-purple': t.accent,
    '--brand-purple-rgb': hexToRgbChannels(t.accent),
    '--brand-button-text': t.buttonText,
    '--background': t.paper,
    '--foreground': t.text,
    '--surface': t.surface,
    '--text-muted': t.textMuted,
  };
}
