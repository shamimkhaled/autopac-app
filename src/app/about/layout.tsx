import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Auto Pac — World Class Machinery Supplier Since 1990',
  description: 'Auto Pac is Bangladesh\'s premier importer, manufacturer, and supplier of food processing and packaging machinery since 1990. 500+ machines delivered, 300+ happy clients, 22+ machine categories covering food, beverage, pharmaceutical, cosmetics, and industrial sectors.',
  keywords: 'Auto Pac company, Bangladesh machinery supplier, food processing company Dhaka, packaging machine importer since 1990, Kawran Bazar machinery, industrial automation Bangladesh, Auto Pac Machinery history',
  openGraph: {
    title: 'About Auto Pac Machinery — Est. 1990, Dhaka Bangladesh',
    description: 'Since 1990, Auto Pac has been Bangladesh\'s most trusted importer, manufacturer, and supplier of industrial automation machinery. 500+ machines delivered across 22+ categories.',
    url: 'https://autopacbd.com/about',
  },
  alternates: { canonical: 'https://autopacbd.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
