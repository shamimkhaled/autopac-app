'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { usePathname } from 'next/navigation';
import { useCompany } from '@/hooks/useSiteData';

export default function Header() {
  const { locale, setLocale, t } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [company] = useCompany();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const logoUrl = company?.logoUrl || '/images/logo.png';

  return (
    <header className="bg-industrial-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="bg-industrial-charcoal py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-action-orange transition" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={`https://wa.me/${company?.whatsapp || '8801818496642'}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-green-400 transition" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLocale('en')} className={`px-3 py-1 rounded text-sm font-medium transition ${locale === 'en' ? 'bg-action-orange text-white' : 'text-white/70 hover:text-white'}`}>EN</button>
            <button onClick={() => setLocale('bn')} className={`px-3 py-1 rounded text-sm font-medium transition font-bengali ${locale === 'bn' ? 'bg-action-orange text-white' : 'text-white/70 hover:text-white'}`}>বাংলা</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-auto min-w-[120px]">
              <Image src={logoUrl} alt="Auto Pac" fill className="object-contain object-left" priority sizes="160px" />
            </div>
            <span className="hidden md:inline text-sm text-white/80 border-l border-white/30 pl-3">
              {locale === 'bn' ? company?.taglineBn || 'বিশ্বমানের মেশিনারি' : company?.taglineEn || 'World Class Machinery'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`font-medium transition hover:text-action-orange ${pathname === link.href ? 'text-action-orange' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`font-medium py-2 transition ${pathname === link.href ? 'text-action-orange' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
