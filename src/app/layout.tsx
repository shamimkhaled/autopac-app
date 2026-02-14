import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/context/LocaleContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import WhatsAppFloating from '@/components/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'Auto Pac – World Class Food Processing & Packaging Machinery',
  description: 'Auto Pac supplies world-class food processing and packaging machinery. Food, Pharma, Cosmetics & Industrial packaging solutions in Bangladesh.',
  keywords: 'packaging machine, food processing, Bangladesh, automatic packing, spice packing, bottling machine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <LocaleProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyCTA />
          <WhatsAppFloating />
        </LocaleProvider>
      </body>
    </html>
  );
}
