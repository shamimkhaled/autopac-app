import type { MetadataRoute } from 'next';
import { getBrandTheme, getPwaConfig } from '@/lib/siteAppearance';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [pwa, theme] = await Promise.all([getPwaConfig(), getBrandTheme()]);

  return {
    id: '/',
    name: pwa.appName,
    short_name: pwa.shortName,
    description: pwa.description,
    start_url: pwa.startUrl || '/?source=pwa',
    scope: '/',
    display: pwa.displayMode,
    orientation: pwa.orientation,
    background_color: pwa.backgroundColor || theme.paper,
    theme_color: pwa.themeColor || theme.primary,
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'shopping'],
    prefer_related_applications: false,
    icons: [
      {
        src: pwa.icon192Url || '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: pwa.icon512Url || '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: pwa.maskableIconUrl || '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: pwa.shortcut1Name || 'Browse machinery',
        short_name: pwa.shortcut1Name || 'Machines',
        description: 'Search food processing and packaging machines',
        url: pwa.shortcut1Url || '/products?source=pwa',
        icons: [{ src: pwa.icon192Url || '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: pwa.shortcut2Name || 'Official catalog',
        short_name: pwa.shortcut2Name || 'Catalog',
        description: 'Open the 122-page brochure',
        url: pwa.shortcut2Url || '/brochure?source=pwa',
        icons: [{ src: pwa.icon192Url || '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: pwa.shortcut3Name || 'Request a quote',
        short_name: pwa.shortcut3Name || 'Quote',
        description: 'Send a quotation request',
        url: pwa.shortcut3Url || '/contact?source=pwa',
        icons: [{ src: pwa.icon192Url || '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
