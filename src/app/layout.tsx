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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-industrial-light text-industrial-charcoal dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
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
