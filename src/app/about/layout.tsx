import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Auto Pac — World Class Machinery Supplier',
  description: 'Learn about Auto Pac, Bangladesh\'s premier importer and manufacturer of food processing and packaging machinery. 15+ years of industrial engineering excellence.',
  keywords: 'Auto Pac company, Bangladesh machinery supplier, food processing company Dhaka, packaging machine importer',
  openGraph: {
    title: 'About Auto Pac Machinery',
    description: 'Pioneering industrial automation in Bangladesh for over 15 years.',
    url: 'https://autopacbd.com/about',
  },
  alternates: { canonical: 'https://autopacbd.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
