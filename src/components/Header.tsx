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
    { href: '/blog', label: 'News/Blog' },
    { href: '/contact', label: t('nav.contact') || 'Contact Us' },
  ];

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const tagline = locale === 'bn' ? company?.taglineBn : company?.taglineEn;
  const whatsappNumber = company?.whatsapp || '8801818496642';

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2' : 'bg-white dark:bg-gray-900 py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="relative h-10 w-28 sm:h-12 sm:w-36 flex-shrink-0">
              <Image src={logoUrl} alt="Auto Pac Logo" fill className="object-contain object-left dark:brightness-200 dark:contrast-100" priority sizes="(max-width: 640px) 112px, 144px" />
            </div>
            {tagline && (
              <div className="hidden lg:block h-8 border-l border-gray-300 dark:border-gray-600 mx-2"></div>
            )}
            {tagline && (
              <span className="hidden lg:inline text-xs font-medium text-gray-500 dark:text-gray-400 max-w-[150px] leading-tight">
                {tagline}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? 'text-action-orange'
                    : 'text-industrial-dark dark:text-white hover:text-action-orange dark:hover:text-action-orange'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-3 border-r border-gray-200 dark:border-gray-700 pr-4 sm:pr-6">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-action-orange hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Get Quote
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-lg text-industrial-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-action-orange/10 text-action-orange'
                        : 'text-industrial-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="block w-full py-3 text-center bg-action-orange hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
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
