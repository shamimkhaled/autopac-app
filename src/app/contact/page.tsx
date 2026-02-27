'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ClipboardList, UserCheck, Calculator } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  companyName: z.string().optional(),
  productInterest: z.string().min(2, 'Product interest is required'),
  message: z.string().min(10, 'Please provide more details'),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

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
    defaultValues: {
      productInterest: defaultProduct,
    }
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setIsSuccess(true);
        reset();
      } else {
        setErrorMsg('Failed to submit. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      icon: ClipboardList,
      title: locale === 'bn' ? '১. ফর্ম পূরণ করুন' : '1. Submit Request',
      desc: locale === 'bn' ? 'আপনার প্রয়োজনীয় মেশিন এবং বিস্তারিত তথ্য দিন।' : 'Fill out the form with your required machinery details.',
    },
    {
      icon: UserCheck,
      title: locale === 'bn' ? '২. বিশেষজ্ঞের পরামর্শ' : '2. Expert Consultation',
      desc: locale === 'bn' ? 'আমাদের টিম আপনার সাথে যোগাযোগ করে সঠিক মডেলটি নির্বাচন করতে সাহায্য করবে।' : 'Our team contacts you to understand exact requirements and suggest the best model.',
    },
    {
      icon: Calculator,
      title: locale === 'bn' ? '৩. কাস্টম কোটেশন' : '3. Get Custom Quote',
      desc: locale === 'bn' ? 'আপনি একটি অফিসিয়াল এবং কাস্টমাইজড মূল্যের কোটেশন পাবেন।' : 'Receive a formal, customized quotation with technical specifications and pricing.',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Page header */}
      <div className="bg-industrial-charcoal dark:bg-black text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-action-orange/10 dark:bg-action-orange/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
          >
            {locale === 'bn' ? 'কোটেশন অনুরোধ করুন' : 'Request a Quotation'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-white/80 text-lg max-w-2xl mx-auto"
          >
            {locale === 'bn' 
              ? 'মেশিনের বিস্তারিত এবং মূল্য জানতে নিচের ফর্মটি পূরণ করুন।' 
              : 'Get in touch with us for machinery details, pricing, and technical support.'}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* User Friendly Guide Steps */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className="w-14 h-14 mx-auto bg-orange-100 dark:bg-orange-900/30 text-action-orange flex items-center justify-center rounded-full mb-4">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-industrial-dark dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Form - 3 columns */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 sm:p-10 relative overflow-hidden">
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-industrial-dark dark:text-white mb-2">
                    {locale === 'bn' ? 'অনুরোধ সফলভাবে পাঠানো হয়েছে!' : 'Request Sent Successfully!'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {locale === 'bn' 
                      ? 'আপনার আগ্রহের জন্য ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই ইমেইল বা ফোনের মাধ্যমে আপনার সাথে যোগাযোগ করবে।' 
                      : 'Thank you for your interest. An automated confirmation email has been sent to you. Our team will contact you shortly with the quotation.'}
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-industrial-dark dark:text-white rounded-full font-medium transition-colors"
                  >
                    {locale === 'bn' ? 'নতুন অনুরোধ পাঠান' : 'Send Another Request'}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-industrial-dark dark:text-white mb-8">
                    {locale === 'bn' ? 'বিস্তারিত ফর্ম' : 'Quotation Form'}
                  </h2>
                  
                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-sm">{locale === 'bn' ? 'আপনার নাম' : 'Full Name'} *</label>
                        <input 
                          type="text" 
                          {...register('name')}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all outline-none text-industrial-dark dark:text-white" 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-sm">{locale === 'bn' ? 'ফোন নম্বর' : 'Phone Number'} *</label>
                        <input 
                          type="tel" 
                          {...register('phone')}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all outline-none text-industrial-dark dark:text-white" 
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-sm">{locale === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} *</label>
                        <input 
                          type="email" 
                          {...register('email')}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all outline-none text-industrial-dark dark:text-white" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-sm">{locale === 'bn' ? 'কোম্পানির নাম (ঐচ্ছিক)' : 'Company Name (Optional)'}</label>
                        <input 
                          type="text" 
                          {...register('companyName')}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all outline-none text-industrial-dark dark:text-white" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-sm">{locale === 'bn' ? 'পছন্দের মেশিন / পণ্য' : 'Product of Interest'} *</label>
                      <input 
                        type="text" 
                        {...register('productInterest')}
                        placeholder={locale === 'bn' ? 'যেমন: গ্রানুল প্যাকিং মেশিন' : 'e.g. Granules Packing Machine'}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all outline-none text-industrial-dark dark:text-white" 
                      />
                      {errors.productInterest && <p className="text-red-500 text-xs mt-1">{errors.productInterest.message}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-sm">{locale === 'bn' ? 'বিস্তারিত বার্তা' : 'Message / Requirements'} *</label>
                      <textarea 
                        {...register('message')}
                        rows={4} 
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-action-orange focus:border-transparent transition-all outline-none resize-none text-industrial-dark dark:text-white" 
                        placeholder={locale === 'bn' ? 'আপনার প্রোডাকশন ক্যাপাসিটি এবং অন্যান্য রিকোয়ারমেন্ট লিখুন...' : 'Please describe your packaging requirements, capacity needed, etc.'}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-industrial-dark hover:bg-black dark:bg-action-orange dark:hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {locale === 'bn' ? 'রিকোয়েস্ট সাবমিট করুন' : 'Submit Request'}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Contact info & Support - 2 columns */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Support Card */}
            <div className="bg-gradient-to-br from-action-orange to-orange-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
              <p className="text-orange-100 mb-6 text-sm">Skip the form and chat directly with our sales experts on WhatsApp for instant replies.</p>
              
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I want to request a quotation.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white text-action-orange hover:bg-gray-50 font-bold py-3 px-6 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                {locale === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}
              </a>
            </div>

            {/* General Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h3 className="text-lg font-bold text-industrial-dark dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-industrial-dark dark:text-white text-sm">Address</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{company?.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-industrial-dark dark:text-white text-sm">Phone</h4>
                    <a href={`tel:+88${(company?.phone || '').replace(/\D/g, '').slice(0, 11)}`} className="text-gray-600 dark:text-gray-400 hover:text-action-orange transition-colors mt-1 block text-sm">
                      {company?.phone || '01631769707, 01818496642'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-industrial-dark dark:text-white text-sm">Email</h4>
                    <a href={`mailto:${company?.email || 'autopacbd@gmail.com'}`} className="text-gray-600 dark:text-gray-400 hover:text-action-orange transition-colors mt-1 block text-sm">
                      {company?.email || 'autopacbd@gmail.com'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="w-12 h-12 border-4 border-action-orange border-t-transparent rounded-full animate-spin"></div></div>}>
      <ContactContent />
    </Suspense>
  );
}
