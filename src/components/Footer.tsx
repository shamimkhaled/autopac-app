'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany, useWebsiteContent } from '@/hooks/useSiteData';
import { MapPin, Phone, Mail, Facebook, Youtube, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const { t, locale } = useLocale();
  const [company] = useCompany();
  const [content] = useWebsiteContent();
  const isBn = locale === 'bn';

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const address = company?.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh';
  const phone = company?.phone || '01631769707';
  const email = company?.email || 'autopacbd@gmail.com';
  const primaryPhone = phone.split(/[,،\s]+/)[0].trim().replace(/\D/g, '');
  const telHref = primaryPhone ? `tel:+88${primaryPhone}` : '#';

  const heading = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-white mb-5';
  const item = 'block text-sm text-stone-400 hover:text-white transition-colors py-1';

  return (
    <footer aria-label="Site footer" className="bg-stone-950 text-stone-300 pt-14 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-block relative h-12 w-36" aria-label="Auto Pac — Home">
              <Image
                src={logoUrl}
                alt="Auto Pac Packaging Solutions"
                fill
                sizes="144px"
                className="object-contain object-left brightness-200"
              />
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              {isBn ? content.footer.blurbBn : content.footer.blurbEn}
            </p>
            {(company?.facebookUrl || company?.youtubeUrl || company?.linkedinUrl) && (
              <div className="flex items-center gap-2">
                {company?.facebookUrl && (
                  <a
                    href={company.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Auto Pac on Facebook"
                    className="w-10 h-10 border border-stone-700 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {company?.youtubeUrl && (
                  <a
                    href={company.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Auto Pac on YouTube"
                    className="w-10 h-10 border border-stone-700 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {company?.linkedinUrl && (
                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Auto Pac on LinkedIn"
                    className="w-10 h-10 border border-stone-700 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <nav aria-label="Quick links">
            <h3 className={heading}>{t('footer.quickLinks') || 'Explore'}</h3>
            <ul className="space-y-1">
              {[
                { href: '/products', label: isBn ? 'মেশিনারি' : 'Machinery' },
                { href: '/brochure', label: t('nav.catalog') || 'Catalog' },
                { href: '/gallery', label: t('nav.gallery') || 'Gallery' },
                { href: '/news', label: t('nav.news') || 'News' },
                { href: '/about', label: t('nav.about') || 'About' },
                { href: '/contact', label: t('nav.contact') || 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={item}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Product lines">
            <h3 className={heading}>{isBn ? 'প্রধান লাইন' : 'Key lines'}</h3>
            <ul className="space-y-1">
              {[
                { href: '/products?line=agro-packing', label: isBn ? 'চাল ও আটা প্যাকিং' : 'Rice & atta packing' },
                { href: '/products?line=water-treatment', label: isBn ? 'ওয়াটার ট্রিটমেন্ট' : 'Water treatment' },
                { href: '/products?line=beverage', label: isBn ? 'জুস ও বেভারেজ' : 'Juice & beverage' },
                { href: '/products?line=cosmetics', label: isBn ? 'কসমেটিক্স' : 'Cosmetics packing' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={item}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic">
            <h3 className={heading}>{t('footer.contactUs') || 'Contact'}</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="w-4 h-4 text-brand-maroon flex-shrink-0" />
                <a href={telHref} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="w-4 h-4 text-brand-maroon flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white break-all">
                  {email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Auto Pac. {t('common.allRights') || 'All rights reserved.'}
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-5 text-xs text-stone-500">
            <Link href="/privacy" className="hover:text-white">
              {t('footer.privacy') || 'Privacy'}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {t('footer.terms') || 'Terms'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
