'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { usePathname } from 'next/navigation';
import { useCompany } from '@/hooks/useSiteData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Menu, X, Facebook, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [company] = useCompany();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') || 'Home' },
    { href: '/about', label: t('nav.about') || 'About Us' },
    { href: '/products', label: t('nav.products') || 'Products' },
    { href: '/projects', label: 'Projects' },
    { href: '/news', label: 'Industry News' },
    { href: '/contact', label: t('nav.contact') || 'Contact Us' },
  ];

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const tagline = locale === 'bn' ? company?.taglineBn : company?.taglineEn;
  const whatsappNumber = company?.whatsapp || '8801818496642';

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-2xl py-2' 
        : 'bg-white/50 dark:bg-transparent backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-4 group" onClick={closeMenu}>
            <div className="relative h-12 w-32 sm:h-14 sm:w-44 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image src={logoUrl} alt="Auto Pac Logo" fill className="object-contain object-left dark:brightness-200" priority sizes="(max-width: 640px) 128px, 176px" />
            </div>
            {tagline && (
              <div className="hidden lg:block h-10 border-l border-gray-200 dark:border-slate-800 mx-1"></div>
            )}
            {tagline && (
              <span className="hidden lg:inline text-[10px] font-bold text-gray-400 dark:text-slate-500 max-w-[140px] leading-tight uppercase tracking-widest">
                {tagline}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                  pathname === link.href
                    ? 'text-action-orange'
                    : 'text-industrial-dark dark:text-slate-300 hover:text-action-orange dark:hover:text-action-orange'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-action-orange transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 border-r border-gray-100 dark:border-slate-800 pr-6">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-action-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-action-orange/20 hover:-translate-y-1 active:scale-95"
            >
              Get Quote
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-industrial-dark dark:text-white transition-all hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="xl:hidden fixed inset-x-0 top-[72px] bottom-0 bg-white dark:bg-slate-950 z-50 overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-8 space-y-8">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
                      pathname === link.href
                        ? 'bg-action-orange text-white shadow-xl shadow-action-orange/20'
                        : 'text-industrial-dark dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex justify-center"><LanguageToggle /></div>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex justify-center"><ThemeToggle /></div>
              </div>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex w-full py-5 items-center justify-center bg-action-orange text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-action-orange/20"
              >
                Request Quotation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
