'use client';

import Link from 'next/link';
import { useCompany } from '@/hooks/useSiteData';
import { useLocale } from '@/context/LocaleContext';
import { ArrowRight, MessageCircle, PhoneCall } from 'lucide-react';

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
    <section className="section-pad bg-brand-paper dark:bg-stone-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-7 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="section-kicker mb-2.5">
              {isBn ? 'সরাসরি প্রকৌশল ও বিক্রয় ডেস্ক' : 'Direct Engineering & Sales Desk'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 dark:text-white [text-wrap:balance]">
              {title ||
                (isBn
                  ? 'আপনার কারখানার জন্য মেশিন কোটেশন নিন'
                  : 'Request specifications and pricing for your factory')}
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400 leading-relaxed">
              {description ||
                (isBn
                  ? 'মেশিনের মডেল, উৎপাদন সক্ষমতা এবং কারখানার ঠিকানা দিন। কাওরান বাজার অফিস থেকে দ্রুত উত্তর পাবেন।'
                  : 'Share your required capacity and product line. Our Dhaka engineering team replies with machinery specifications and layout guidance.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 shrink-0">
            <Link href="/contact" className="btn-primary whitespace-nowrap shrink-0">
              {isBn ? 'কোটেশন ফর্ম' : 'Request Quotation'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={`tel:+88${phone.replace(/\D/g, '')}`}
              className="btn-secondary whitespace-nowrap shrink-0 tabular-nums"
            >
              <PhoneCall className="w-4 h-4 text-brand-ink" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
