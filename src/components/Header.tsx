'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { usePathname } from 'next/navigation';
import { useCompany } from '@/hooks/useSiteData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [company] = useCompany();
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Throttle scroll handler with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: '/',         label: t('nav.home')     || 'Home' },
    { href: '/about',    label: t('nav.about')    || 'About Us' },
    { href: '/products', label: t('nav.products') || 'Products' },
    { href: '/gallery',  label: t('nav.gallery')  || 'Gallery' },
    { href: '/news',     label: t('nav.news')     || 'News' },
    { href: '/contact',  label: t('nav.contact')  || 'Contact Us' },
  ];

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const tagline = locale === 'bn' ? company?.taglineBn : company?.taglineEn;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-lg py-2'
          : 'bg-white/60 dark:bg-transparent backdrop-blur-sm py-3 sm:py-4'
      }`}
    >
      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-action-orange focus:text-white focus:font-bold focus:rounded-lg focus:text-sm"
      >
        {t('common.skipToContent') || 'Skip to main content'}
      </a>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group min-w-0" onClick={closeMenu} aria-label="Auto Pac — Home">
            <div className="relative h-10 w-28 sm:h-12 sm:w-36 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src={logoUrl}
                alt="Auto Pac Logo"
                fill
                className="object-contain object-left dark:brightness-200"
                priority
                sizes="(max-width: 640px) 112px, 144px"
              />
            </div>
            {tagline && (
              <>
                <div className="hidden xl:block h-8 border-l border-gray-200 dark:border-slate-800 mx-1" aria-hidden="true" />
                <span className="hidden xl:inline text-[10px] font-bold text-gray-400 dark:text-slate-500 max-w-[160px] leading-tight uppercase tracking-widest truncate">
                  {tagline}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all relative group whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-action-orange'
                    : 'text-industrial-dark dark:text-slate-300 hover:text-action-orange dark:hover:text-action-orange'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-0 h-0.5 bg-action-orange transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme & Language — visible at lg+ on desktop, also inside mobile menu */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 border-r border-gray-100 dark:border-slate-800 pr-3 sm:pr-4">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-action-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all shadow-md shadow-action-orange/20 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              {t('nav.getQuote') || 'Get Quote'}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="xl:hidden p-2.5 sm:p-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-industrial-dark dark:text-white transition-all hover:bg-gray-100 dark:hover:bg-slate-800 touch-manipulation"
            >
              {menuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            aria-modal="true"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bottom-0 bg-white dark:bg-slate-950 z-50 overflow-y-auto"
          >
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 min-h-full">
              {/* Nav Links */}
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`flex items-center px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all touch-manipulation ${
                      pathname === link.href
                        ? 'bg-action-orange text-white shadow-lg shadow-action-orange/20'
                        : 'text-industrial-dark dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 active:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Theme & Language toggles — always accessible on mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {locale === 'bn' ? 'ভাষা' : 'Language'}
                  </span>
                  <LanguageToggle />
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex w-full py-4 sm:py-5 items-center justify-center bg-action-orange text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-action-orange/20 hover:bg-orange-600 transition-all touch-manipulation mt-auto"
              >
                {t('nav.requestQuotation') || 'Request Quotation'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
