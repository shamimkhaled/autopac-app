import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Auto Pac Machinery',
    short_name: 'Auto Pac',
    description:
      'Find food processing and packaging machinery, preview the official 122-page catalog, and request a quote.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F7F4EF',
    theme_color: '#6D1A2D',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'shopping'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
