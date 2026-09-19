'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompany } from '@/hooks/useSiteData';
import { useLocale } from '@/context/LocaleContext';

export default function StickyCTA() {
  const pathname = usePathname();
  const [company] = useCompany();
  const { locale } = useLocale();
  const whatsapp = company?.whatsapp || '8801818496642';

  const show =
    pathname?.startsWith('/products') || pathname?.startsWith('/brochure');
  if (!show) return null;

  const isBn = locale === 'bn';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-stone-200 bg-white dark:bg-stone-950 dark:border-stone-800 safe-area-pb">
      <div className="grid grid-cols-2 gap-2 px-3 py-2">
        <Link href="/contact" className="btn-primary text-[13px]">
          {isBn ? 'কোটেশন চান' : 'Request quote'}
        </Link>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-[13px]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
