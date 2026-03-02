import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Machinery Gallery — Auto Pac Industrial Equipment',
  description: 'Browse our complete machinery gallery — food processing, packaging, pharmaceutical, cosmetics, and industrial automation equipment. Request a quote directly from any machine.',
  keywords: 'machinery gallery, packaging machine photos, food processing equipment Bangladesh, industrial automation gallery',
  openGraph: {
    title: 'Machinery Gallery — Auto Pac',
    description: 'High-quality images of our complete industrial machinery range.',
    url: 'https://autopacbd.com/gallery',
  },
  alternates: { canonical: 'https://autopacbd.com/gallery' },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
