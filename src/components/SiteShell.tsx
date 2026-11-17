'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import SupportHub from './SupportHub';
import VisitorBeacon from './VisitorBeacon';
import PWARegister from './PWARegister';

interface PwaUiFlags {
  showMobileStickyBar: boolean;
  showWhatsAppButton: boolean;
  showSupportChat: boolean;
}

/**
 * Renders the public-site chrome (Header, Footer, SupportHub) for all routes EXCEPT
 * /admin/* — admin pages have their own self-contained layout with sidebar.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [pwaFlags, setPwaFlags] = useState<PwaUiFlags>({
    showMobileStickyBar: true,
    showWhatsAppButton: true,
    showSupportChat: true,
  });

  useEffect(() => {
    if (isAdmin) return;
    fetch('/api/appearance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.pwa) {
          setPwaFlags({
            showMobileStickyBar: d.pwa.showMobileStickyBar !== false,
            showWhatsAppButton: d.pwa.showWhatsAppButton !== false,
            showSupportChat: d.pwa.showSupportChat !== false,
          });
        }
      })
      .catch(() => {});
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  const hasMobileBottomBar =
    pwaFlags.showMobileStickyBar || pwaFlags.showWhatsAppButton || pwaFlags.showSupportChat;

  return (
    <>
      <VisitorBeacon />
      <PWARegister />
      <Header />
      <main
        id="main-content"
        className={`flex-1 ${hasMobileBottomBar ? 'pb-20 md:pb-0' : ''}`}
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
      <SupportHub
        showMobileStickyBar={pwaFlags.showMobileStickyBar}
        showWhatsAppButton={pwaFlags.showWhatsAppButton}
        showSupportChat={pwaFlags.showSupportChat}
      />
    </>
  );
}
