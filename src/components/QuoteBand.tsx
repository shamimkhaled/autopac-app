'use client';

import Link from 'next/link';
import { useCompany } from '@/hooks/useSiteData';
import { useLocale } from '@/context/LocaleContext';
import { Phone } from 'lucide-react';

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

  return (
    <section className="bg-brand-maroon text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
            {isBn ? 'পরবর্তী ধাপ' : 'Next step'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            {title ||
              (isBn
                ? 'একটি মেশিনের জন্য কোটেশন চান'
                : 'Request a quotation for a specific machine')}
          </h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            {description ||
              (isBn
                ? 'নাম, ফোন এবং আপনার আগ্রহের মেশিন লিখুন। আমরা স্পেসিফিকেশন ও মূল্য নিয়ে যোগাযোগ করব।'
                : 'Tell us the machine, your factory, and capacity. We reply with specifications and pricing.')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/contact" className="btn-primary bg-white text-brand-maroon hover:bg-stone-100">
            {isBn ? 'কোটেশন ফর্ম' : 'Request a quote'}
          </Link>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 border border-white/40 text-white text-sm font-semibold rounded-md hover:bg-white/10"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
