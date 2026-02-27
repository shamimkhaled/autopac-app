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
  const phone = company?.phone || '01631769707, 01818496642';
  const email = company?.email || 'autopacbd@gmail.com';

  return (
    <footer className="bg-industrial-dark text-gray-300 dark:bg-black pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block relative h-12 w-36">
              <Image 
                src={logoUrl} 
                alt="Auto Pac Logo" 
                fill 
                className="object-contain object-left brightness-200 contrast-100" 
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {locale === 'bn' 
                ? 'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি সরবরাহকারী প্রতিষ্ঠান। আমরা সেরা মানের মেশিন এবং বিক্রয়োত্তর সেবা প্রদান করি।'
                : 'Supplier of world-class food processing and packaging machinery. We provide premium quality machines with excellent after-sales service.'}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {company?.facebookUrl && (
                <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action-orange hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {company?.youtubeUrl && (
                <a href={company.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action-orange hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {company?.linkedinUrl && (
                <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-action-orange hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: t('nav.home') || 'Home' },
                { href: '/about', label: t('nav.about') || 'About Us' },
                { href: '/products', label: t('nav.products') || 'Products' },
                { href: '/projects', label: 'Projects' },
                { href: '/blog', label: 'News/Blog' },
                { href: '/contact', label: t('nav.contact') || 'Contact Us' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 group text-sm hover:text-action-orange transition-colors">
                    <MoveRight className="w-4 h-4 text-gray-600 group-hover:text-action-orange transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Top Categories</h3>
            <ul className="space-y-3">
              {[
                { href: '/products?category=food-beverage', label: locale === 'bn' ? 'খাদ্য ও পানীয়' : 'Food & Beverage' },
                { href: '/products?category=health-pharma', label: locale === 'bn' ? 'ফার্মাসিউটিক্যাল' : 'Pharmaceutical' },
                { href: '/products?category=cosmetics-toiletries', label: locale === 'bn' ? 'কসমেটিক্স' : 'Cosmetics' },
                { href: '/products?category=industrial', label: locale === 'bn' ? 'ইন্ডাস্ট্রিয়াল' : 'Industrial' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 group text-sm hover:text-action-orange transition-colors">
                    <MoveRight className="w-4 h-4 text-gray-600 group-hover:text-action-orange transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-action-orange flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-action-orange flex-shrink-0" />
                <a href={`tel:+88${phone.replace(/\D/g, '').slice(0, 11)}`} className="hover:text-action-orange transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-action-orange flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-action-orange transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Auto Pac. {t('common.allRights') || 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
