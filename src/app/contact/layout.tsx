import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote — Auto Pac Machinery',
  description: 'Request a custom machinery quotation from Auto Pac. Fill out our engineering inquiry form for food processing, packaging, pharmaceutical, and cosmetics machinery in Bangladesh.',
  keywords: 'machinery quotation, packaging machine quote, food processing machine Bangladesh, contact AutoPac',
  openGraph: {
    title: 'Request an Engineering Quote — Auto Pac',
    description: 'Get a tailored quote for world-class industrial packaging and processing machinery.',
    url: 'https://autopacbd.com/contact',
  },
  alternates: { canonical: 'https://autopacbd.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
