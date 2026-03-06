'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';
import { MapPin, Phone, Mail, Facebook, Youtube, Linkedin, MoveRight } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const { t, locale } = useLocale();
  const [company] = useCompany();

  const logoUrl = company?.logoUrl || '/images/logo.png';
  const address = company?.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh';
  const phone = company?.phone || '01631769707';
  const email = company?.email || 'autopacbd@gmail.com';

  // Safely extract the first phone number for the tel: link
  const primaryPhone = phone.split(/[,،\s]+/)[0].trim().replace(/\D/g, '');
  const telHref = primaryPhone ? `tel:+88${primaryPhone}` : '#';

  return (
    <footer
      aria-label="Site footer"
      className="bg-industrial-dark text-gray-300 dark:bg-black pt-14 pb-8 border-t border-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">

          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-block relative h-12 w-36" aria-label="Auto Pac — Home">
              <Image
                src={logoUrl}
                alt="Auto Pac Logo"
                fill
                sizes="144px"
                className="object-contain object-left brightness-200 contrast-100"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {locale === 'bn'
                ? 'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি সরবরাহকারী প্রতিষ্ঠান। আমরা সেরা মানের মেশিন এবং বিক্রয়োত্তর সেবা প্রদান করি।'
                : 'Supplier of world-class food processing and packaging machinery. We provide premium quality machines with excellent after-sales service.'}
            </p>

            {/* Social Icons */}
            {(company?.facebookUrl || company?.youtubeUrl || company?.linkedinUrl) && (
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                  {t('footer.followUs') || 'Follow Us'}
                </p>
                <div className="flex items-center gap-3">
                  {company?.facebookUrl && (
                    <a
                      href={company.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Auto Pac on Facebook ${t('common.openInNewTab') || '(opens in new tab)'}`}
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action-orange transition-colors focus:outline-none focus:ring-2 focus:ring-action-orange focus:ring-offset-2 focus:ring-offset-industrial-dark"
                    >
                      <Facebook className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                  {company?.youtubeUrl && (
                    <a
                      href={company.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Auto Pac on YouTube ${t('common.openInNewTab') || '(opens in new tab)'}`}
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action-orange transition-colors focus:outline-none focus:ring-2 focus:ring-action-orange focus:ring-offset-2 focus:ring-offset-industrial-dark"
                    >
                      <Youtube className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                  {company?.linkedinUrl && (
                    <a
                      href={company.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Auto Pac on LinkedIn ${t('common.openInNewTab') || '(opens in new tab)'}`}
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action-orange transition-colors focus:outline-none focus:ring-2 focus:ring-action-orange focus:ring-offset-2 focus:ring-offset-industrial-dark"
                    >
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">
              {t('footer.quickLinks') || 'Quick Links'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/',         label: t('nav.home')     || 'Home' },
                { href: '/about',    label: t('nav.about')    || 'About Us' },
                { href: '/products', label: t('nav.products') || 'Products' },
                { href: '/gallery',  label: t('nav.gallery')  || 'Gallery' },
                { href: '/news',     label: t('nav.news')     || 'News' },
                { href: '/contact',  label: t('nav.contact')  || 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 group text-sm hover:text-action-orange transition-colors py-0.5"
                  >
                    <MoveRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-action-orange transition-colors flex-shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Top Categories */}
          <nav aria-label="Product categories">
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">
              {t('footer.topCategories') || 'Top Categories'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/products?category=food-beverage',      label: locale === 'bn' ? 'খাদ্য ও পানীয়'      : 'Food & Beverage' },
                { href: '/products?category=health-pharma',      label: locale === 'bn' ? 'ফার্মাসিউটিক্যাল'   : 'Pharmaceutical' },
                { href: '/products?category=cosmetics-toiletries', label: locale === 'bn' ? 'কসমেটিক্স'         : 'Cosmetics' },
                { href: '/products?category=industrial',         label: locale === 'bn' ? 'ইন্ডাস্ট্রিয়াল'   : 'Industrial' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 group text-sm hover:text-action-orange transition-colors py-0.5"
                  >
                    <MoveRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-action-orange transition-colors flex-shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="not-italic">
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">
              {t('footer.contactUs') || 'Contact Us'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-action-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-action-orange flex-shrink-0" aria-hidden="true" />
                <a
                  href={telHref}
                  className="hover:text-action-orange transition-colors"
                  aria-label={`Call ${phone}`}
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-action-orange flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-action-orange transition-colors break-all"
                >
                  {email}
                </a>
              </li>
            </ul>
          </address>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} Auto Pac. {t('common.allRights') || 'All rights reserved.'}
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy') || 'Privacy Policy'}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t('footer.terms') || 'Terms of Service'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
