'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';
import { BROCHURE_LINES } from '@/data/brochure';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ClipboardList,
  UserCheck,
  Calculator,
  MessageCircle,
  Globe,
  Loader2,
  Paperclip,
  X,
  FileText,
  Upload,
  Factory,
  Sparkles,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { queueQuote, type QuoteAttachmentItem } from '@/lib/quoteQueue';
import PageHero from '@/components/PageHero';

const quoteSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  companyName: z.string().optional(),
  factoryLocation: z.string().optional(),
  capacityTarget: z.string().optional(),
  productInterest: z.string().min(2),
  message: z.string().min(10),
  _hp: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const SCALE_OPTIONS = [
  { id: 'Startup / SME', en: 'Startup / SME', bn: 'নতুন / ক্ষুদ্র উদ্যোক্তা' },
  { id: 'Medium Factory', en: 'Medium Factory', bn: 'মাঝারি কারখানা' },
  { id: 'Turnkey Plant', en: 'Turnkey Industrial Plant', bn: 'বৃহৎ টার্নকি প্ল্যান্ট' },
];

const MAX_FILES = 3;
const inputClass = 'input-field min-h-[46px]';
const labelClass =
  'block text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400 mb-1.5';

function formatBytes(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ContactContent() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get('product') || '';
  const { t, locale } = useLocale();
  const isBn = locale === 'bn';
  const [company] = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState<{
    product: string;
    attachments: QuoteAttachmentItem[];
  } | null>(null);
  const [queuedOffline, setQueuedOffline] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [scale, setScale] = useState('Medium Factory');
  const [showLinePicker, setShowLinePicker] = useState(false);
  const [attachments, setAttachments] = useState<QuoteAttachmentItem[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const whatsapp = (company?.whatsapp || '8801818496642').replace(/\D/g, '');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { productInterest: defaultProduct },
  });

  const currentProduct = watch('productInterest') || '';

  useEffect(() => {
    if (defaultProduct) setValue('productInterest', defaultProduct);
  }, [defaultProduct, setValue]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadErr('');

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setUploadErr(
        isBn
          ? 'আপনি অফলাইন — ফাইল আপলোডের জন্য ইন্টারনেট সংযোগ প্রয়োজন।'
          : 'You are offline — file attachments require an internet connection.'
      );
      return;
    }

    const availableSlots = MAX_FILES - attachments.length;
    if (availableSlots <= 0) {
      setUploadErr(
        isBn
          ? `সর্বোচ্চ ${MAX_FILES}টি ফাইল সংযুক্ত করা যাবে।`
          : `Maximum ${MAX_FILES} attachments allowed.`
      );
      return;
    }

    const files = Array.from(fileList).slice(0, availableSlots);
    setUploadingFile(true);

    try {
      for (const file of files) {
        if (file.size > 8 * 1024 * 1024) {
          setUploadErr(
            isBn
              ? `${file.name} ফাইলটি ৮ এমবি-র বেশি।`
              : `${file.name} exceeds the 8 MB limit.`
          );
          continue;
        }
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/quote/attachment', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) {
          setUploadErr(data?.error || `Failed to upload ${file.name}`);
        } else {
          setAttachments((prev) => [...prev, data as QuoteAttachmentItem]);
        }
      }
    } catch {
      setUploadErr(
        isBn ? 'ফাইল আপলোড করা যায়নি। আবার চেষ্টা করুন।' : 'Upload failed. Please try again.'
      );
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (url: string) => {
    setAttachments((prev) => prev.filter((a) => a.url !== url));
  };

  const onSubmit = async (data: QuoteFormValues) => {
    if (data._hp) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setQueuedOffline(false);

    const payload = {
      ...data,
      scale,
      attachments,
    };

    const enqueue = () => {
      queueQuote({
        name: data.name,
        phone: data.phone,
        email: data.email,
        companyName: data.companyName,
        factoryLocation: data.factoryLocation,
        scale,
        capacityTarget: data.capacityTarget,
        productInterest: data.productInterest,
        message: data.message,
        attachments,
      });
      setSubmittedSummary({ product: data.productInterest, attachments });
      setQueuedOffline(true);
      setIsSuccess(true);
      setAttachments([]);
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
        body: JSON.stringify(payload),
      });
      if (res.status === 429) {
        setErrorMsg(
          isBn
            ? 'অনেক অনুরোধ। কিছুক্ষণ পরে আবার চেষ্টা করুন।'
            : 'Too many requests. Please wait a moment.'
        );
        return;
      }
      if (res.ok) {
        setSubmittedSummary({ product: data.productInterest, attachments });
        setIsSuccess(true);
        setAttachments([]);
        reset();
      } else {
        setErrorMsg(
          isBn
            ? 'জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
            : 'Failed to submit. Please try again.'
        );
      }
    } catch {
      enqueue();
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: ClipboardList, title: t('contact.step1Title'), desc: t('contact.step1Desc') },
    { icon: UserCheck, title: t('contact.step2Title'), desc: t('contact.step2Desc') },
    { icon: Calculator, title: t('contact.step3Title'), desc: t('contact.step3Desc') },
  ];

  return (
    <div className="page-shell">
      <PageHero
        kicker={isBn ? 'কোটেশন ও প্রকৌশল পরামর্শ' : 'Request a factory quotation'}
        title={t('contact.subtitle')}
        description={
          isBn
            ? 'মেশিনের নাম, কারখানা এবং কাঙ্ক্ষিত উৎপাদন ক্ষমতা লিখুন — চাইলে পাউচ বা ফ্লোর প্ল্যান ছবিও সংযুক্ত করতে পারেন।'
            : 'Specify your machine, target output, and district — optionally attach a sample pack photo or PDF layout for accurate pricing.'
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {steps.map((step, idx) => (
            <div key={idx} className="surface-card p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-7 h-7 rounded-md bg-brand-maroon/10 text-brand-maroon flex items-center justify-center shrink-0">
                  <step.icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-1">
                {step.title}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Modern Guided Quotation Form */}
          <div className="lg:col-span-7 surface-card p-5 sm:p-8 lg:p-10">
            {isSuccess ? (
              <div
                role="status"
                aria-live="polite"
                className="py-10 sm:py-14 text-center space-y-5"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight">
                    {queuedOffline
                      ? isBn
                        ? 'কোটেশন ফোনে সংরক্ষিত হয়েছে'
                        : 'Quote queued on this device'
                      : t('contact.successTitle')}
                  </h3>
                  <p className="text-stone-500 max-w-md mx-auto text-sm leading-relaxed">
                    {queuedOffline
                      ? isBn
                        ? 'আপনি এখন অফলাইনে আছেন। ইন্টারনেট ফিরলে আপনার কোটেশন স্বয়ংক্রিয়ভাবে আমাদের ইঞ্জিনিয়ারিং টিমে পৌঁছে যাবে।'
                        : 'You are offline. As soon as your connection returns, this quotation will sync automatically.'
                      : t('contact.successDesc')}
                  </p>
                </div>

                {submittedSummary && (
                  <div className="max-w-md mx-auto text-left p-4 rounded-md bg-brand-paper/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {isBn ? 'অনুরোধকৃত মেশিন:' : 'Requested line:'}{' '}
                      <span className="text-brand-maroon">{submittedSummary.product}</span>
                    </p>
                    {submittedSummary.attachments.length > 0 && (
                      <p className="text-stone-500">
                        {isBn ? 'সংযুক্ত ফাইল:' : 'Attachments:'}{' '}
                        {submittedSummary.attachments.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setQueuedOffline(false);
                      setSubmittedSummary(null);
                    }}
                    className="btn-primary"
                  >
                    {t('contact.submitNew')}
                  </button>
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                      `Hello Auto Pac, I just submitted a quotation request for: ${submittedSummary?.product || 'Machinery'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    {isBn ? 'হোয়াটসঅ্যাপে ফলো-আপ' : 'Follow up on WhatsApp'}
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-stone-200 dark:border-stone-800 pb-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight">
                      {t('contact.getInTouch')}
                    </h2>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {isBn ? '২৪ ঘণ্টার মধ্যে উত্তর' : '24h Engineering Reply'}
                    </span>
                  </div>
                  {defaultProduct && (
                    <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-maroon/10 text-brand-maroon text-xs sm:text-sm font-medium">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      {isBn ? 'নির্বাচিত মেশিন:' : 'Quoting:'} {defaultProduct}
                    </p>
                  )}
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md text-red-700 dark:text-red-400 text-sm"
                  >
                    {errorMsg}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="relative space-y-6"
                >
                  {/* Honeypot */}
                  <div
                    aria-hidden="true"
                    className="absolute opacity-0 pointer-events-none h-0 overflow-hidden"
                  >
                    <label htmlFor="_hp">Leave this empty</label>
                    <input
                      id="_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register('_hp')}
                    />
                  </div>

                  {/* Step 1: Machine & Factory Specs */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-maroon flex items-center gap-1.5">
                        <Factory className="w-3.5 h-3.5" />
                        {isBn ? '১. মেশিন ও উৎপাদন তথ্য' : '1. Machinery & Production Spec'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowLinePicker((s) => !s)}
                        className="text-xs font-semibold text-brand-maroon hover:underline cursor-pointer"
                      >
                        {showLinePicker
                          ? isBn
                            ? 'তালিকা বন্ধ করুন'
                            : 'Hide 16 lines'
                          : isBn
                            ? '১৬টি লাইন থেকে বাছুন'
                            : 'Pick from 16 lines'}
                      </button>
                    </div>

                    {showLinePicker && (
                      <div className="p-3 rounded-md bg-brand-paper/70 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap gap-1.5">
                        {BROCHURE_LINES.map((line) => {
                          const label = isBn ? line.shortBn : line.shortEn;
                          const selected = currentProduct === label;
                          return (
                            <button
                              key={line.id}
                              type="button"
                              onClick={() => {
                                setValue('productInterest', label, { shouldValidate: true });
                                setShowLinePicker(false);
                              }}
                              className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                                selected
                                  ? 'bg-brand-maroon text-white border-brand-maroon'
                                  : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-brand-maroon'
                              }`}
                            >
                              {line.number} · {label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div>
                      <label htmlFor="productInterest" className={labelClass}>
                        {t('contact.formProduct')} *
                      </label>
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
                        <p
                          id="product-error"
                          role="alert"
                          className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5"
                        >
                          {isBn ? 'মেশিন বা পণ্যের নাম লিখুন' : 'Product interest is required'}
                        </p>
                      )}
                    </div>

                    {/* Factory Scale Chips */}
                    <div>
                      <span className={labelClass}>
                        {isBn ? 'কারখানার ধরন (ঐচ্ছিক)' : 'Project scale (Optional)'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {SCALE_OPTIONS.map((opt) => {
                          const active = scale === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setScale(opt.id)}
                              className={`px-3 py-2.5 rounded-md border text-xs font-semibold text-left transition-colors cursor-pointer ${
                                active
                                  ? 'border-brand-maroon bg-brand-maroon/10 text-brand-maroon'
                                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                              }`}
                            >
                              {isBn ? opt.bn : opt.en}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="capacityTarget" className={labelClass}>
                          {isBn ? 'কাঙ্ক্ষিত ক্ষমতা (ঐচ্ছিক)' : 'Target output / pack size'}
                        </label>
                        <input
                          id="capacityTarget"
                          type="text"
                          placeholder={
                            isBn ? 'যেমন: ৫০ প্যাক/মিনিট বা ১০০০ লিটার' : 'e.g. 40 packs/min or 1000 LPH'
                          }
                          {...register('capacityTarget')}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="factoryLocation" className={labelClass}>
                          {isBn ? 'কারখানার জেলা / ঠিকানা' : 'Factory district / country'}
                        </label>
                        <input
                          id="factoryLocation"
                          type="text"
                          placeholder={
                            isBn ? 'যেমন: গাজীপুর, চট্টগ্রাম, বগুড়া' : 'e.g. Gazipur, Dhaka, Chattogram'
                          }
                          {...register('factoryLocation')}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Contact Info */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                      {isBn ? '২. যোগাযোগের তথ্য' : '2. Contact Details'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          {t('contact.formName')} *
                        </label>
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
                          <p
                            id="name-error"
                            role="alert"
                            className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5"
                          >
                            {isBn ? 'নাম দিন (কমপক্ষে ২ অক্ষর)' : 'Name required (min 2 characters)'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          {t('contact.formPhone')} *
                        </label>
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
                          <p
                            id="phone-error"
                            role="alert"
                            className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5"
                          >
                            {isBn ? 'বৈধ ফোন বা হোয়াটসঅ্যাপ নম্বর দিন' : 'Valid phone number required'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          {t('contact.formEmail')} *
                        </label>
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
                          <p
                            id="email-error"
                            role="alert"
                            className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5"
                          >
                            {isBn ? 'বৈধ ইমেইল দিন' : 'Valid email required'}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="companyName" className={labelClass}>
                          {t('contact.formCompany')}
                        </label>
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
                  </div>

                  {/* Step 3: Requirements & Optional Attachments */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                      {isBn ? '৩. বিস্তারিত ও ফাইল সংযুক্তি' : '3. Requirements & Attachments'}
                    </p>

                    <div>
                      <label htmlFor="message" className={labelClass}>
                        {t('contact.formMessage')} *
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder={t('contact.formMessagePlaceholder')}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        {...register('message')}
                        className={`${inputClass} h-auto py-3 resize-y`}
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          role="alert"
                          className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5"
                        >
                          {isBn
                            ? 'বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)'
                            : 'Please provide more details (min 10 chars)'}
                        </p>
                      )}
                    </div>

                    {/* Optional Attachment Dropzone */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={labelClass + ' mb-0'}>
                          <Paperclip className="w-3 h-3 inline mr-1" />
                          {isBn
                            ? 'নমুনা ছবি বা ফ্লোর প্ল্যান পিডিএফ (ঐচ্ছিক)'
                            : 'Sample pack photo, layout sketch or PDF spec (Optional)'}
                        </span>
                        <span className="text-[11px] text-stone-400 tabular-nums">
                          {attachments.length}/{MAX_FILES}
                        </span>
                      </div>

                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => {
                          if (!uploadingFile && attachments.length < MAX_FILES) {
                            fileInputRef.current?.click();
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && attachments.length < MAX_FILES) {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }
                        }}
                        className={`rounded-md border border-dashed p-4 text-center transition-colors cursor-pointer ${
                          dragOver
                            ? 'border-brand-maroon bg-brand-maroon/5'
                            : 'border-stone-300 dark:border-stone-700 bg-brand-paper/50 dark:bg-stone-900/60 hover:border-brand-maroon'
                        } ${attachments.length >= MAX_FILES ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={(e) => handleFiles(e.target.files)}
                          className="hidden"
                        />
                        {uploadingFile ? (
                          <div className="flex items-center justify-center gap-2 py-2 text-xs text-stone-600 dark:text-stone-300">
                            <Loader2 className="w-4 h-4 animate-spin text-brand-maroon" />
                            <span>{isBn ? 'ফাইল আপলোড হচ্ছে…' : 'Uploading attachment…'}</span>
                          </div>
                        ) : (
                          <div className="space-y-1 py-1">
                            <Upload className="w-5 h-5 text-brand-maroon mx-auto" aria-hidden="true" />
                            <p className="text-xs font-medium text-stone-700 dark:text-stone-200">
                              {isBn
                                ? 'ক্লিক করুন অথবা ছবি/পিডিএফ টেনে আনুন'
                                : 'Tap to choose files or drag & drop here'}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              {isBn
                                ? 'JPG, PNG, WebP বা PDF · সর্বোচ্চ ৮ এমবি প্রতিটি (সর্বোচ্চ ৩টি)'
                                : 'JPG, PNG, WebP or PDF · Up to 8 MB each (max 3 files)'}
                            </p>
                          </div>
                        )}
                      </div>

                      {uploadErr && (
                        <p role="alert" className="text-xs text-red-600 dark:text-red-400 mt-1.5">
                          {uploadErr}
                        </p>
                      )}

                      {attachments.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {attachments.map((file) => {
                            const isImg = file.mimeType?.startsWith('image/');
                            return (
                              <li
                                key={file.url}
                                className="flex items-center justify-between gap-3 p-2.5 rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {isImg ? (
                                    <div className="relative w-10 h-10 rounded overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                                      <Image
                                        src={file.url}
                                        alt={file.name}
                                        fill
                                        className="object-cover"
                                        referrerPolicy="no-referrer"
                                        sizes="40px"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-brand-maroon/10 text-brand-maroon flex items-center justify-center shrink-0">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">
                                      {file.name}
                                    </p>
                                    {file.size && (
                                      <p className="text-[11px] text-stone-400 tabular-nums">
                                        {formatBytes(file.size)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(file.url)}
                                  className="p-1.5 text-stone-400 hover:text-red-600 rounded cursor-pointer"
                                  aria-label={`Remove ${file.name}`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingFile}
                    className="btn-primary w-full min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed"
                    aria-label={
                      isSubmitting
                        ? isBn
                          ? 'পাঠানো হচ্ছে...'
                          : 'Submitting...'
                        : t('contact.submit')
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />{' '}
                        {isBn ? 'পাঠানো হচ্ছে...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" /> {t('contact.submit')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-brand-maroon text-white p-6 sm:p-8 rounded-md">
              <MessageCircle className="w-6 h-6 mb-4" aria-hidden="true" />
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {t('contact.directAccess')}
              </h3>
              <p className="mt-2 text-white/80 text-sm leading-relaxed">
                {t('contact.directAccessDesc')}
              </p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('contact.startChat')} ${t('common.openInNewTab') || '(opens in new tab)'}`}
                className="btn-white mt-6"
              >
                {t('contact.startChat')}
              </a>
            </div>

            <div className="overflow-hidden border border-stone-200 dark:border-stone-800 rounded-md relative h-[220px] sm:h-[260px]">
              <iframe
                src={
                  company?.mapEmbedUrl ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.1562059738454!2d90.39299931498197!3d23.750885784590633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cffc3fb%3A0x4a826f475fd312af!2sKawran%20Bazar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd'
                }
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

            <div className="surface-card p-6 sm:p-8 space-y-5">
              <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-white tracking-tight">
                {t('contact.corporateHQ')}
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: t('contact.officeAddress'),
                    value: company?.address || '128/3 Kawran Bazar, Dhaka 1215',
                  },
                  {
                    icon: Phone,
                    label: t('contact.phoneLines'),
                    value: company?.phone || '01631769707, 01818496642',
                    href: `tel:${company?.phone || '01631769707'}`,
                  },
                  {
                    icon: Mail,
                    label: t('contact.emailServices'),
                    value: company?.email || 'autopacbd@gmail.com',
                    href: `mailto:${company?.email || 'autopacbd@gmail.com'}`,
                  },
                  {
                    icon: Globe,
                    label: t('contact.webPresence'),
                    value: company?.website || 'www.autopacbd.com',
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex gap-3">
                    <Icon
                      className="w-4 h-4 text-brand-maroon flex-shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-stone-900 dark:text-white text-sm hover:text-brand-maroon"
                        >
                          {value}
                        </a>
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
    <Suspense
      fallback={
        <div className="page-shell flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" aria-label="Loading..." />
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
