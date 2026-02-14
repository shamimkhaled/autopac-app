'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

interface StickyCTAProps {
  productName?: string;
  productSlug?: string;
}

const WHATSAPP_NUMBER = '8801818496642';

export default function StickyCTA({ productName, productSlug }: StickyCTAProps) {
  const { t } = useLocale();

  const whatsappMessage = productName
    ? `Hi, I am interested in ${productName}. Please send me a quote.`
    : 'Hi, I am interested in Auto Pac machinery. Please send me more information.';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-industrial-dark/95 backdrop-blur-sm border-t border-white/10 shadow-lg safe-area-pb">
      <div className="flex gap-3 p-4">
        <Link
          href={productSlug ? `/contact?product=${productSlug}` : '/contact'}
          className="flex-1 bg-action-orange hover:bg-action-orange-dark text-white font-bold py-3 px-4 rounded-lg text-center transition text-sm"
        >
          {t('products.requestQuote')}
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          </svg>
          {t('products.inquireWhatsApp')}
        </a>
      </div>
    </div>
  );
}
