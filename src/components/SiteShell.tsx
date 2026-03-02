'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import StickyCTA from './StickyCTA';
import WhatsAppFloating from './WhatsAppFloating';
import Chatbot from './Chatbot';
import VisitorBeacon from './VisitorBeacon';

/**
 * Renders the public-site chrome (Header, Footer, CTAs) for all routes EXCEPT
 * /admin/* — admin pages have their own self-contained layout with sidebar.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin layout manages its own full-screen structure; render children directly.
    return <>{children}</>;
  }

  return (
    <>
      <VisitorBeacon />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <StickyCTA />
      <WhatsAppFloating />
      <Chatbot />
    </>
  );
}
