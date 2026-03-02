import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry & Global News — Auto Pac',
  description: 'Stay updated with the latest trends in food processing, packaging, and industrial technology. Bangladesh and international news curated for manufacturers.',
  keywords: 'industrial news Bangladesh, food processing news, packaging industry news, manufacturing news',
  openGraph: {
    title: 'Industry News — Auto Pac',
    description: 'Latest food processing, packaging, and industrial technology news.',
    url: 'https://autopacbd.com/news',
  },
  alternates: { canonical: 'https://autopacbd.com/news' },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
