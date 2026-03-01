import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import Chatbot from '@/components/Chatbot';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: {
    default: 'Auto Pac – World Class Food Processing & Packaging Machinery',
    template: '%s | Auto Pac Machinery'
  },
  description: 'Auto Pac is the premier importer and local manufacturer of world-class food processing and packaging machinery in Bangladesh. Serving Food, Pharma, Cosmetics & Chemical industries.',
  keywords: 'packaging machine, food processing, Bangladesh, automatic packing, spice packing, bottling machine, detergent packing, liquid filling, industrial automation',
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
    languages: {
      'en-US': 'https://autopacbd.com/en',
      'bn-BD': 'https://autopacbd.com/bn',
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add actual code later
  },
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Auto Pac',
  url: 'https://autopacbd.com/',
  logo: 'https://autopacbd.com/images/logo.png',
  description: 'Auto Pac is the premier importer and local manufacturer of world-class food processing and packaging machinery in Bangladesh.',
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-industrial-light text-industrial-charcoal dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyCTA />
          <WhatsAppFloating />
          <Chatbot />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
