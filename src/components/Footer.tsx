'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-industrial-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h3 className="text-lg font-bold text-action-orange mb-4">
            {t('footer.productsWePack')}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed font-bengali">
            {t('footer.productList')}
          </p>
        </div>
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-white/70">
            © {new Date().getFullYear()} Auto Pac. {t('common.allRights')}
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-white/70 hover:text-action-orange transition text-sm">
              {t('nav.home')}
            </Link>
            <Link href="/products" className="text-white/70 hover:text-action-orange transition text-sm">
              {t('nav.products')}
            </Link>
            <Link href="/about" className="text-white/70 hover:text-action-orange transition text-sm">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-action-orange transition text-sm">
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
