import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Barlow_Condensed, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import SiteShell from '@/components/SiteShell';
import Analytics from '@/components/Analytics';

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autopacbd.com';

export const viewport: Viewport = {
  themeColor: '#6D1A2D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Auto Pac – World Class Food Processing & Packaging Machinery Since 1990',
    template: '%s | Auto Pac Machinery'
  },
  description: 'Auto Pac — established 1990, Kawran Bazar, Dhaka. Premier importer, manufacturer & supplier of world-class food processing and packaging machinery in Bangladesh. 500+ machines delivered, 300+ happy clients, 22+ machine categories.',
  keywords: 'Auto Pac machinery Bangladesh, packaging machine Dhaka, food processing equipment, automatic packing machine, spice packing, bottling machine, detergent packing, liquid filling, industrial automation, Kawran Bazar machinery, since 1990',
  authors: [{ name: 'Auto Pac Engineering Team' }],
  creator: 'Auto Pac',
  publisher: 'Auto Pac',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://autopacbd.com/',
    siteName: 'Auto Pac Machinery',
    title: 'Auto Pac – World Class Industrial Machinery Solutions',
    description: 'Premier manufacturer and importer of high-performance packaging and processing systems in Bangladesh.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Auto Pac Machinery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto Pac Machinery',
    description: 'World-class industrial automation solutions in Bangladesh.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://autopacbd.com/',
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: 'Auto Pac',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Auto Pac',
  url: 'https://autopacbd.com/',
  logo: 'https://autopacbd.com/images/logo.png',
  foundingDate: '1990',
  description: 'Auto Pac — established 1990 — is the premier importer, manufacturer, and supplier of world-class food processing and packaging machinery in Bangladesh, serving 300+ clients across 22+ machine categories.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '128/3 Kawran Bazar',
    addressLocality: 'Dhaka',
    postalCode: '1215',
    addressCountry: 'BD',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+8801631769707',
    contactType: 'sales',
    areaServed: 'BD',
    availableLanguage: ['English', 'Bengali'],
  },
  sameAs: [
    'https://www.facebook.com/autopacbd',
    'https://www.youtube.com/@autopacbd',
    'https://www.linkedin.com/company/autopacbd',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${ibmPlex.variable} ${barlow.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-brand-paper text-stone-800 dark:bg-stone-950 dark:text-stone-100 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <SiteShell>
            {children}
          </SiteShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
