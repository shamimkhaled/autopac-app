'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@/context/LocaleContext';
import { usePathname } from 'next/navigation';
import { BROCHURE_LINES, lineHref } from '@/data/brochure';
import { useCompany, useCatalogMap } from '@/hooks/useSiteData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import SiteSearch from './SiteSearch';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [linesOpen, setLinesOpen] = useState(false);
  const [mobileLinesOpen, setMobileLinesOpen] = useState(false);
  const [company] = useCompany();
  const [catalogMap] = useCatalogMap();
  const linesRef = useRef<HTMLDivElement>(null);
  const isBn = locale === 'bn';

  useEffect(() => {
    setMenuOpen(false);
    setLinesOpen(false);
    setMobileLinesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (linesRef.current && !linesRef.current.contains(e.target as Node)) {
        setLinesOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { href: '/', label: t('nav.home') || 'Home' },
    { href: '/products', label: t('nav.products') || (locale === 'bn' ? 'মেশিনারি' : 'Machinery') },
    { href: '/brochure', label: t('nav.catalog') || 'Catalog' },
    { href: '/gallery', label: t('nav.gallery') || 'Gallery' },
    { href: '/news', label: t('nav.news') || 'News' },
    { href: '/about', label: t('nav.about') || 'About' },
    { href: '/contact', label: t('nav.contact') || 'Contact' },
  ];

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-[100] bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-maroon focus:text-white focus:font-semibold focus:rounded-md focus:text-sm"
      >
        {t('common.skipToContent') || 'Skip to main content'}
      </a>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center min-w-0" onClick={closeMenu} aria-label="Auto Pac — Home">
            <div className="relative h-10 w-28 sm:h-11 sm:w-36 flex-shrink-0">
              <Image
                src={logoUrl}
                alt="Auto Pac Packaging Solutions"
                fill
                key={logoUrl}
                unoptimized={logoUrl.startsWith('/uploads/') || logoUrl.startsWith('http')}
                className="object-contain object-left dark:brightness-200"
                priority
                sizes="(max-width: 640px) 112px, 144px"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.href === '/products' ? (
                <div key={link.href} className="relative" ref={linesRef}>
                  <button
                    type="button"
                    onClick={() => setLinesOpen((o) => !o)}
                    aria-expanded={linesOpen}
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-1 text-[13px] font-medium transition-colors duration-200 cursor-pointer ${
                      isActive('/products') || isActive('/brochure')
                        ? 'text-brand-maroon'
                        : 'text-stone-700 dark:text-stone-300 hover:text-brand-maroon'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${linesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {linesOpen && (
                    <div className="absolute left-0 top-full mt-3 w-[min(36rem,calc(100vw-2rem))] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md shadow-lg p-3 z-50">
                      <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-stone-200 dark:border-stone-800">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-maroon">
                          {isBn ? 'পণ্য লাইন' : 'Product lines'}
                        </p>
                        <Link
                          href="/products"
                          onClick={() => setLinesOpen(false)}
                          className="text-xs font-semibold text-stone-600 hover:text-brand-maroon"
                        >
                          {isBn ? 'সব মেশিন' : 'All machinery'}
                        </Link>
                      </div>
                      <ul className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                        {BROCHURE_LINES.map((line) => (
                          <li key={line.id}>
                            <Link
                              href={lineHref(line.id, catalogMap)}
                              onClick={() => setLinesOpen(false)}
                              className="flex items-baseline gap-2 px-2 py-2 rounded-md text-sm text-stone-700 dark:text-stone-300 hover:bg-brand-paper dark:hover:bg-stone-800 hover:text-brand-maroon"
                            >
                              <span className="font-display text-[11px] text-brand-maroon w-5 shrink-0">
                                {line.number}
                              </span>
                              {isBn ? line.shortBn : line.shortEn}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`text-[13px] font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-brand-maroon'
                      : 'text-stone-700 dark:text-stone-300 hover:text-brand-maroon'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden xl:block">
              <SiteSearch compact />
            </div>
            <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-stone-200 dark:border-stone-800">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <Link href="/contact" className="btn-primary text-[13px] px-4 sm:px-5">
              <span className="hidden sm:inline">{t('nav.getQuote') || 'Request Quote'}</span>
              <span className="sm:hidden">{locale === 'bn' ? 'কোট' : 'Quote'}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-md border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white flex items-center justify-center cursor-pointer"
            >
              {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {typeof document !== 'undefined' &&
        menuOpen &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            aria-modal="true"
            className="fixed inset-0 bg-white dark:bg-stone-950 z-[9999] overflow-y-auto pt-16"
          >
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="p-3 min-w-[44px] min-h-[44px] rounded-md border border-stone-200 dark:border-stone-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              <SiteSearch />
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                {navLinks.map((link) =>
                  link.href === '/products' ? (
                    <div key={link.href}>
                      <button
                        type="button"
                        onClick={() => setMobileLinesOpen((o) => !o)}
                        aria-expanded={mobileLinesOpen}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-md text-base font-medium cursor-pointer ${
                          isActive('/products')
                            ? 'bg-brand-maroon text-white'
                            : 'text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileLinesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileLinesOpen && (
                        <ul className="mt-1 mb-2 pl-2 border-l-2 border-brand-maroon/30">
                          <li>
                            <Link
                              href="/products"
                              onClick={closeMenu}
                              className="block px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300"
                            >
                              {isBn ? 'সব মেশিন' : 'All machinery'}
                            </Link>
                          </li>
                          {BROCHURE_LINES.map((line) => (
                            <li key={line.id}>
                              <Link
                                href={lineHref(line.id, catalogMap)}
                                onClick={closeMenu}
                                className="flex items-baseline gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400"
                              >
                                <span className="font-display text-[11px] text-brand-maroon w-5">
                                  {line.number}
                                </span>
                                {isBn ? line.shortBn : line.shortEn}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={`px-4 py-3.5 rounded-md text-base font-medium ${
                        isActive(link.href)
                          ? 'bg-brand-maroon text-white'
                          : 'text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-md flex items-center justify-center gap-2">
                  <ThemeToggle />
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-md flex items-center justify-center gap-2">
                  <LanguageToggle />
                </div>
              </div>
              <Link href="/contact" onClick={closeMenu} className="btn-primary w-full">
                {t('nav.requestQuotation') || 'Request Quotation'}
              </Link>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
