'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany, useWebsiteContent } from '@/hooks/useSiteData';
import { MapPin, Phone, Mail, Facebook, Youtube, Linkedin, Clock } from 'lucide-react';
import Image from 'next/image';
import PWAInstallButton from './PWAInstallButton';

export default function Footer() {
  const { t, locale } = useLocale();
  const [company] = useCompany();
  const [content] = useWebsiteContent();
  const isBn = locale === 'bn';

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const address = company?.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh';
  const phone = company?.phone || '01631769707, 01818496642';
  const email = company?.email || 'autopacbd@gmail.com';
  const officeHours = company?.officeHours || 'Sat – Thu: 9:30 AM – 6:30 PM (BST)';
  const primaryPhone = phone.split(/[,،\s]+/)[0].trim().replace(/\D/g, '');
  const telHref = primaryPhone ? `tel:+88${primaryPhone}` : '#';

  const heading = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-white mb-4';
  const item = 'block text-sm text-stone-400 hover:text-white transition-colors py-1';

  return (
    <footer aria-label="Site footer" className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-14 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Column 1: Company Identity & Channels */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-block relative h-12 w-36" aria-label="Auto Pac — Home">
              <Image
                src={logoUrl}
                alt="Auto Pac Packaging Solutions"
                fill
                key={logoUrl}
                unoptimized={logoUrl.startsWith('/uploads/') || logoUrl.startsWith('http')}
                sizes="144px"
                className="object-contain object-left brightness-200"
              />
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              {isBn ? content.footer.blurbBn : content.footer.blurbEn}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {company?.facebookUrl && (
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Auto Pac on Facebook"
                  className="w-10 h-10 rounded-md border border-stone-700 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={company?.youtubeUrl || 'https://www.youtube.com/@autopacbd'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Auto Pac on YouTube"
                className="w-10 h-10 rounded-md border border-stone-700 flex items-center justify-center hover:border-white hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              {company?.linkedinUrl && (
                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Auto Pac on LinkedIn"
                  className="w-10 h-10 rounded-md border border-stone-700 flex items-center justify-center hover:border-white hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              <PWAInstallButton variant="footer" />
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <nav aria-label="Quick links">
            <h3 className={heading}>{t('footer.quickLinks') || 'Explore'}</h3>
            <ul className="space-y-1">
              {[
                { href: '/products', label: isBn ? 'মেশিনারি' : 'Machinery' },
                { href: '/brochure', label: t('nav.catalog') || '122-Page Catalog' },
                { href: '/gallery?tab=videos', label: isBn ? 'গ্যালারি ও ভিডিও' : 'Gallery & Video' },
                { href: '/news', label: t('nav.news') || 'Industry News' },
                { href: '/about', label: t('nav.about') || 'About Auto Pac' },
                { href: '/contact', label: t('nav.contact') || 'Request Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={item}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Key Machinery Lines */}
          <nav aria-label="Product lines">
            <h3 className={heading}>{isBn ? 'প্রধান লাইন' : 'Machinery Lines'}</h3>
            <ul className="space-y-1">
              {[
                { href: '/products?line=agro-packing', label: isBn ? 'চাল, আটা ও ডাল প্যাকিং' : 'Rice, Atta & Grain Packing' },
                { href: '/products?line=snacks-spices', label: isBn ? 'মসলা ও চানাচুর লাইন' : 'Spices, Chips & Chanachur' },
                { href: '/products?line=water-treatment', label: isBn ? 'ওয়াটার ট্রিটমেন্ট প্ল্যান্ট' : 'Mineral Water Plants' },
                { href: '/products?line=beverage', label: isBn ? 'জুস ও বেভারেজ লাইন' : 'Juice & Beverage Bottling' },
                { href: '/products?line=cosmetics', label: isBn ? 'কসমেটিক্স ও ফার্মা লাইন' : 'Cosmetics & Pharma Packing' },
                { href: '/products?line=sealing-coding', label: isBn ? 'সিলিং ও ডেট কোডিং' : 'Band Sealer & Date Coding' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={item}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Bangladesh HQ & Support */}
          <address className="not-italic">
            <h3 className={heading}>{t('footer.contactUs') || 'Dhaka Headquarters'}</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-0.5" />
                <a href={telHref} className="hover:text-white tabular-nums">
                  {phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="hover:text-white break-all">
                  {email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-0.5" />
                <span>{officeHours}</span>
              </li>
            </ul>
          </address>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Auto Pac Machinery (Est. 1990 · Dhaka, Bangladesh).{' '}
            {t('common.allRights') || 'All rights reserved.'}
          </p>
          <nav aria-label="Legal & portal links" className="flex items-center gap-5 text-xs text-stone-500">
            <Link href="/privacy" className="hover:text-white">
              {t('footer.privacy') || 'Privacy'}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {t('footer.terms') || 'Terms'}
            </Link>
            <Link href="/admin" className="hover:text-white">
              {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Portal'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
