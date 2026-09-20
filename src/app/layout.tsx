import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Barlow_Condensed, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import SiteShell from '@/components/SiteShell';
import Analytics from '@/components/Analytics';
import { getBrandTheme, getSeoMarketing } from '@/lib/siteAppearance';

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

export async function generateViewport(): Promise<Viewport> {
  const theme = await getBrandTheme();
  return {
    themeColor: theme.primary,
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMarketing();
  const verification =
    seo.googleSiteVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seo.siteTitle,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
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
      url: baseUrl,
      siteName: 'Auto Pac Machinery',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: seo.ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Auto Pac Machinery',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: [seo.ogImageUrl],
    },
    alternates: {
      canonical: baseUrl,
    },
    ...(verification
      ? {
          verification: {
            google: verification,
          },
        }
      : {}),
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsIndex,
      googleBot: {
        index: seo.robotsIndex,
        follow: seo.robotsIndex,
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
    other: {
      'mobile-web-app-capable': 'yes',
    },
    icons: {
      icon: [
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSeoMarketing();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Auto Pac',
    url: baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
    logo: `${baseUrl.replace(/\/$/, '')}/images/logo.png`,
    foundingDate: '1990',
    description: seo.schemaDescription,
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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${ibmPlex.variable} ${barlow.variable} ${hindSiliguri.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-brand-paper text-stone-800 dark:bg-stone-950 dark:text-stone-100 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
