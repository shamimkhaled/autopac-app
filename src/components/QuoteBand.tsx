'use client';

import Link from 'next/link';
import { useCompany } from '@/hooks/useSiteData';
import { useLocale } from '@/context/LocaleContext';
import { MessageCircle, PhoneCall } from 'lucide-react';

export default function QuoteBand({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { locale } = useLocale();
  const [company] = useCompany();
  const isBn = locale === 'bn';
  const whatsapp = company?.whatsapp || '8801818496642';
  const phone = (company?.phone || '01631769707').split(/[,،\s]+/)[0].trim();

  return (
    <section className="bg-brand-maroon text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 mb-3">
            {isBn ? 'সরাসরি প্রকৌশল ও বিক্রয় ডেস্ক' : 'Direct Engineering & Sales Desk'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight [text-wrap:balance]">
            {title ||
              (isBn
                ? 'আপনার কারখানার জন্য মেশিন কোটেশন নিন'
                : 'Request specifications and pricing for your factory')}
          </h2>
          <p className="mt-3 text-white/85 leading-relaxed">
            {description ||
              (isBn
                ? 'মেশিনের মডেল, উৎপাদন সক্ষমতা এবং কারখানার ঠিকানা দিন। কাওরান বাজার অফিস থেকে দ্রুত উত্তর পাবেন।'
                : 'Share your required capacity and product line. Our Dhaka engineering team replies with machinery specifications and layout guidance.')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 shrink-0">
          <Link href="/contact" className="btn-white whitespace-nowrap shrink-0">
            {isBn ? 'কোটেশন ফর্ম' : 'Request Quotation'}
          </Link>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-white/45 text-white text-sm font-semibold rounded-md hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href={`tel:+88${phone.replace(/\D/g, '')}`}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-white/30 text-white text-sm font-semibold rounded-md hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 tabular-nums"
          >
            <PhoneCall className="w-4 h-4" aria-hidden="true" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
