import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Machinery Catalog Brochure — Auto Pac',
  description:
    'Official Auto Pac machinery catalog: 122 brochure pages of food processing, packaging, beverage, cosmetic, and industrial plants. Preview every sheet exactly as printed, then request a quote.',
  keywords:
    'Auto Pac catalog, packaging machine brochure Bangladesh, food processing machinery PDF, packing machine catalog Dhaka',
  openGraph: {
    title: 'Official Machinery Catalog — Auto Pac',
    description:
      'Preview the official 122-page Auto Pac machinery brochure. Same pages the product owner uses for sales.',
    url: 'https://autopacbd.com/brochure',
  },
  alternates: { canonical: 'https://autopacbd.com/brochure' },
};

export default function BrochureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
