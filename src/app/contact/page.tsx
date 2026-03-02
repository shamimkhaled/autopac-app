'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ClipboardList, UserCheck, Calculator, ArrowRight, MessageSquare, Globe, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

const inputClass =
  'w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-industrial-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all';

const labelClass = 'block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1';

function ContactContent() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get('product') || '';
  const { t, locale } = useLocale();
  const [company] = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const whatsapp = company?.whatsapp || '8801818496642';

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { productInterest: defaultProduct },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    // If honeypot is filled, silently succeed (bot detected)
    if (data._hp) { setIsSuccess(true); return; }

    setIsSubmitting(true);
    setErrorMsg('');
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
      setErrorMsg(locale === 'bn' ? 'একটি অপ্রত্যাশিত ত্রুটি হয়েছে।' : 'An unexpected error occurred.');
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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Header */}
      <section className="relative py-20 sm:py-28 md:py-36 bg-industrial-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/slider3.png')] bg-cover bg-center opacity-10 grayscale pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-industrial-dark/40 via-industrial-dark to-industrial-dark pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
              <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
                {t('contact.acquisitionLabel')}
              </span>
              <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-5">
              {t('contact.subtitle')}
            </h1>
            <p className="text-white/60 text-base sm:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              {locale === 'bn'
                ? 'মেশিনের বিস্তারিত এবং মূল্য জানতে নিচের ফর্মটি পূরণ করুন।'
                : 'Accelerate your production with world-class automated machinery.'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20 pb-20 sm:pb-32">
        {/* Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 dark:bg-action-orange/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-action-orange transition-colors duration-500">
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-action-orange group-hover:text-white transition-colors duration-500" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-black text-industrial-dark dark:text-white uppercase tracking-tight mb-2">{step.title}</h3>
              <p className="text-gray-400 dark:text-slate-400 text-xs font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Main Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[50px] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 sm:p-10 lg:p-14">
            {isSuccess ? (
              <div
                role="status"
                aria-live="polite"
                className="py-16 sm:py-20 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto border-4 border-white dark:border-slate-900 shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-green-500" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-industrial-dark dark:text-white uppercase tracking-tight">
                    {t('contact.successTitle')}
                  </h3>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto text-sm">
                    {t('contact.successDesc')}
                  </p>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3.5 bg-industrial-dark dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-action-orange dark:hover:bg-action-orange transition-all"
                >
                  {t('contact.submitNew')}
                </button>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-10">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-industrial-dark dark:text-white uppercase tracking-tight">
                    {t('contact.getInTouch')}
                  </h2>
                  <p className="text-gray-400 dark:text-slate-400 font-medium text-sm">
                    {locale === 'bn' ? 'সঠিক তথ্য প্রদান করলে দ্রুত সাড়া পাবেন।' : 'Please provide accurate data for precise engineering evaluation.'}
                  </p>
                </div>

                {errorMsg && (
                  <div role="alert" aria-live="assertive" className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 sm:space-y-6">
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
                    className="w-full group flex items-center justify-center gap-3 py-4 sm:py-5 bg-action-orange text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
                    aria-label={isSubmitting ? (locale === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...') : t('contact.submit')}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> {locale === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...'}</>
                    ) : (
                      <><Send className="w-4 h-4" aria-hidden="true" /> {t('contact.submit')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" /></>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar — moves above form on mobile */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            {/* WhatsApp Card */}
            <div className="bg-industrial-dark rounded-[40px] sm:rounded-[50px] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-action-orange/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" aria-hidden="true" />
              <div className="relative z-10 space-y-5">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <MessageSquare className="w-7 h-7 text-action-orange" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{t('contact.directAccess')}</h3>
                  <p className="text-white/50 font-medium leading-relaxed text-sm">{t('contact.directAccessDesc')}</p>
                </div>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('contact.startChat')} ${t('common.openInNewTab') || '(opens in new tab)'}`}
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-industrial-dark font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-xl touch-manipulation"
                >
                  {t('contact.startChat')} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            {(company?.mapEmbedUrl || true) && (
              <div className="rounded-[40px] sm:rounded-[50px] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-lg">
                <iframe
                  src={company?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.1562059738454!2d90.39299931498197!3d23.750885784590633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sKawran%20Bazar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd'}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Auto Pac Office Location"
                  className="w-full"
                />
              </div>
            )}

            {/* Corporate Info */}
            <div className="bg-gray-50 dark:bg-slate-900/60 rounded-[40px] sm:rounded-[50px] p-8 sm:p-10 space-y-7 border border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-industrial-dark dark:text-white uppercase tracking-tight">{t('contact.corporateHQ')}</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { icon: MapPin, label: t('contact.officeAddress'), value: company?.address || '128/3 Kawran Bazar, Dhaka 1215' },
                  { icon: Phone,  label: t('contact.phoneLines'),   value: company?.phone   || '01631769707, 01818496642', href: `tel:${company?.phone || '01631769707'}` },
                  { icon: Mail,   label: t('contact.emailServices'), value: company?.email  || 'autopacbd@gmail.com',       href: `mailto:${company?.email || 'autopacbd@gmail.com'}` },
                  { icon: Globe,  label: t('contact.webPresence'),   value: company?.website || 'www.autopacbd.com' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-action-orange" aria-hidden="true" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
                      {href ? (
                        <a href={href} className="text-industrial-dark dark:text-white font-bold text-sm hover:text-action-orange transition-colors">{value}</a>
                      ) : (
                        <p className="text-industrial-dark dark:text-white font-bold text-sm">{value}</p>
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-action-orange animate-spin" aria-label="Loading..." />
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
