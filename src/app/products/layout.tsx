import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industrial Machinery Products — Auto Pac',
  description: 'Browse Auto Pac\'s full catalog of food processing, packaging, pharmaceutical, and cosmetics machinery. Filter by category and request a custom quote today.',
  keywords: 'packaging machinery Bangladesh, food processing machine, automatic packing machine, liquid filling machine, spice packing machine',
  openGraph: {
    title: 'Industrial Machinery Catalog — Auto Pac',
    description: 'Browse our complete catalog of food processing and packaging machinery solutions.',
    url: 'https://autopacbd.com/products',
  },
  alternates: { canonical: 'https://autopacbd.com/products' },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
