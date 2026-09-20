'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';
import { Phone, Mail, MapPin, Send, CheckCircle2, ClipboardList, UserCheck, Calculator, MessageSquare, Globe, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { queueQuote } from '@/lib/quoteQueue';
import PageHero from '@/components/PageHero';

const quoteSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  companyName: z.string().optional(),
  productInterest: z.string().min(2),
  message: z.string().min(10),
  _hp: z.string().optional(), // honeypot — must be empty
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const inputClass = 'input-field min-h-[48px]';
const labelClass = 'block text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400 mb-1.5';

function ContactContent() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get('product') || '';
  const { t, locale } = useLocale();
  const [company] = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [queuedOffline, setQueuedOffline] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const whatsapp = company?.whatsapp || '8801818496642';

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { productInterest: defaultProduct },
  });

  useEffect(() => {
    if (defaultProduct) setValue('productInterest', defaultProduct);
  }, [defaultProduct, setValue]);

  const onSubmit = async (data: QuoteFormValues) => {
    // If honeypot is filled, silently succeed (bot detected)
    if (data._hp) { setIsSuccess(true); return; }

    setIsSubmitting(true);
    setErrorMsg('');
    setQueuedOffline(false);

    const enqueue = () => {
      queueQuote({
        name: data.name,
        phone: data.phone,
        email: data.email,
        companyName: data.companyName,
        productInterest: data.productInterest,
        message: data.message,
      });
      setQueuedOffline(true);
      setIsSuccess(true);
      reset();
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      enqueue();
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.status === 429) {
        setErrorMsg(locale === 'bn' ? 'অনেক অনুরোধ। কিছুক্ষণ পরে আবার চেষ্টা করুন।' : 'Too many requests. Please wait a moment.');
        return;
      }
      if (res.ok) {
        setIsSuccess(true);
        reset();
      } else {
        setErrorMsg(locale === 'bn' ? 'জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Failed to submit. Please try again.');
      }
    } catch {
      enqueue();
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: ClipboardList, title: t('contact.step1Title'), desc: t('contact.step1Desc') },
    { icon: UserCheck,    title: t('contact.step2Title'), desc: t('contact.step2Desc') },
    { icon: Calculator,   title: t('contact.step3Title'), desc: t('contact.step3Desc') },
  ];

  return (
    <div className="page-shell">
      <PageHero
        kicker={locale === 'bn' ? 'কোটেশন' : 'Request a quotation'}
        title={t('contact.subtitle')}
        description={
          locale === 'bn'
            ? 'মেশিনের নাম, কারখানা এবং সক্ষমতা লিখুন। আমরা স্পেসিফিকেশন ও মূল্য নিয়ে যোগাযোগ করব।'
            : 'Name the machine, your factory, and capacity. We reply with specifications and pricing.'
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {steps.map((step, idx) => (
            <div key={idx} className="surface-card p-5 sm:p-6">
              <step.icon className="w-5 h-5 text-brand-maroon mb-3" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-1">{step.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Main Form */}
          <div className="lg:col-span-7 surface-card p-6 sm:p-8 lg:p-10">
            {isSuccess ? (
              <div
                role="status"
                aria-live="polite"
                className="py-12 sm:py-16 text-center space-y-5"
              >
                <CheckCircle2 className="w-10 h-10 text-brand-maroon mx-auto" aria-hidden="true" />
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold text-stone-900 dark:text-white tracking-tight">
                    {queuedOffline
                      ? locale === 'bn'
                        ? 'কোটেশন সংরক্ষিত'
                        : 'Quote saved on this phone'
                      : t('contact.successTitle')}
                  </h3>
                  <p className="text-stone-500 max-w-sm mx-auto text-sm">
                    {queuedOffline
                      ? locale === 'bn'
                        ? 'আপনি অফলাইন। ইন্টারনেট ফিরলে কোটেশন স্বয়ংক্রিয়ভাবে পাঠানো হবে।'
                        : 'You are offline. When you reconnect, we send this quotation automatically.'
                      : t('contact.successDesc')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setQueuedOffline(false);
                  }}
                  className="btn-primary"
                >
                  {t('contact.submitNew')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-white tracking-tight">
                    {t('contact.getInTouch')}
                  </h2>
                  {defaultProduct && (
                    <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-maroon/10 text-brand-maroon text-sm font-medium">
                      {locale === 'bn' ? 'কোটেশনের মেশিন:' : 'Quoting:'} {defaultProduct}
                    </p>
                  )}
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    {locale === 'bn' ? 'সঠিক তথ্য দিলে দ্রুত সাড়া পাবেন।' : 'Accurate details help us specify the right machine.'}
                  </p>
                </div>

                {errorMsg && (
                  <div role="alert" aria-live="assertive" className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md text-red-700 dark:text-red-400 text-sm">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5 sm:space-y-6">
                  {/* Honeypot — hidden from humans, bots fill this */}
                  <div aria-hidden="true" className="absolute opacity-0 pointer-events-none h-0 overflow-hidden">
                    <label htmlFor="_hp">Leave this empty</label>
                    <input id="_hp" type="text" tabIndex={-1} autoComplete="off" {...register('_hp')} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>{t('contact.formName')} *</label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder={t('contact.formNamePlaceholder')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        {...register('name')}
                        className={inputClass}
                      />
                      {errors.name && (
                        <p id="name-error" role="alert" className="text-red-500 text-[10px] font-bold uppercase mt-1.5 ml-1">
                          {locale === 'bn' ? 'নাম দিন (কমপক্ষে ২ অক্ষর)' : 'Name required (min 2 characters)'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>{t('contact.formPhone')} *</label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={t('contact.formPhonePlaceholder')}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        {...register('phone')}
                        className={inputClass}
                      />
                      {errors.phone && (
                        <p id="phone-error" role="alert" className="text-red-500 text-[10px] font-bold uppercase mt-1.5 ml-1">
                          {locale === 'bn' ? 'বৈধ ফোন নম্বর দিন' : 'Valid phone number required'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="email" className={labelClass}>{t('contact.formEmail')} *</label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder={t('contact.formEmailPlaceholder')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        {...register('email')}
                        className={inputClass}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="text-red-500 text-[10px] font-bold uppercase mt-1.5 ml-1">
                          {locale === 'bn' ? 'বৈধ ইমেইল দিন' : 'Valid email required'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="companyName" className={labelClass}>{t('contact.formCompany')}</label>
                      <input
                        id="companyName"
                        type="text"
                        autoComplete="organization"
                        placeholder={t('contact.formCompanyPlaceholder')}
                        {...register('companyName')}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="productInterest" className={labelClass}>{t('contact.formProduct')} *</label>
                    <input
                      id="productInterest"
                      type="text"
                      placeholder={t('contact.formProductPlaceholder')}
                      aria-invalid={!!errors.productInterest}
                      aria-describedby={errors.productInterest ? 'product-error' : undefined}
                      {...register('productInterest')}
                      className={inputClass}
                    />
                    {errors.productInterest && (
                      <p id="product-error" role="alert" className="text-red-500 text-[10px] font-bold uppercase mt-1.5 ml-1">
                        {locale === 'bn' ? 'পণ্যের আগ্রহ উল্লেখ করুন' : 'Product interest required'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>{t('contact.formMessage')} *</label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder={t('contact.formMessagePlaceholder')}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      {...register('message')}
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && (
                      <p id="message-error" role="alert" className="text-red-500 text-[10px] font-bold uppercase mt-1.5 ml-1">
                        {locale === 'bn' ? 'বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)' : 'Please provide more details (min 10 chars)'}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    aria-label={isSubmitting ? (locale === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...') : t('contact.submit')}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> {locale === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...'}</>
                    ) : (
                      <><Send className="w-4 h-4" aria-hidden="true" /> {t('contact.submit')}</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar — moves above form on mobile */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-brand-maroon text-white p-6 sm:p-8">
              <MessageSquare className="w-6 h-6 mb-4" aria-hidden="true" />
              <h3 className="font-display text-2xl font-semibold tracking-tight">{t('contact.directAccess')}</h3>
              <p className="mt-2 text-white/80 text-sm leading-relaxed">{t('contact.directAccessDesc')}</p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('contact.startChat')} ${t('common.openInNewTab') || '(opens in new tab)'}`}
                className="btn-primary bg-white text-brand-maroon hover:bg-stone-100 mt-6"
              >
                {t('contact.startChat')}
              </a>
            </div>

            {(company?.mapEmbedUrl || true) && (
              <div className="overflow-hidden border border-stone-200 dark:border-stone-800 rounded-md relative h-[220px] sm:h-[260px]">
                <iframe
                  src={company?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.1562059738454!2d90.39299931498197!3d23.750885784590633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sKawran%20Bazar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd'}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Auto Pac Office Location"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            )}

            <div className="surface-card p-6 sm:p-8 space-y-5">
              <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-white tracking-tight">{t('contact.corporateHQ')}</h3>
              <ul className="space-y-4">
                {[
                  { icon: MapPin, label: t('contact.officeAddress'), value: company?.address || '128/3 Kawran Bazar, Dhaka 1215' },
                  { icon: Phone,  label: t('contact.phoneLines'),   value: company?.phone   || '01631769707, 01818496642', href: `tel:${company?.phone || '01631769707'}` },
                  { icon: Mail,   label: t('contact.emailServices'), value: company?.email  || 'autopacbd@gmail.com',       href: `mailto:${company?.email || 'autopacbd@gmail.com'}` },
                  { icon: Globe,  label: t('contact.webPresence'),   value: company?.website || 'www.autopacbd.com' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">{label}</p>
                      {href ? (
                        <a href={href} className="text-stone-900 dark:text-white text-sm hover:text-brand-maroon">{value}</a>
                      ) : (
                        <p className="text-stone-900 dark:text-white text-sm">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="page-shell flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" aria-label="Loading..." />
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
