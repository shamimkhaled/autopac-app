'use client';

interface StickyCTAProps {
  productName?: string;
  productSlug?: string;
  pathname?: string | null;
}

/**
 * StickyCTA (Request Quote + Inquire via WhatsApp) removed — buttons disrupted
 * layout on desktop, tablet, and mobile across all pages.
 * Users can still access Contact via header/nav and WhatsApp via the floating icon.
 */
export default function StickyCTA(_props: StickyCTAProps) {
  return null;
}
