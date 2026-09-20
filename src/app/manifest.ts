import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Auto Pac Machinery',
    short_name: 'Auto Pac',
    description:
      'Find food processing and packaging machinery, preview the official 122-page catalog, and request a quote.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#F7F4EF',
    theme_color: '#6D1A2D',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'shopping'],
    prefer_related_applications: false,
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
    shortcuts: [
      {
        name: 'Browse machinery',
        short_name: 'Machines',
        description: 'Search food processing and packaging machines',
        url: '/products?source=pwa',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Official catalog',
        short_name: 'Catalog',
        description: 'Open the 122-page brochure',
        url: '/brochure?source=pwa',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Request a quote',
        short_name: 'Quote',
        description: 'Send a quotation request',
        url: '/contact?source=pwa',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
