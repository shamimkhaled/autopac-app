'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ClipboardList, UserCheck, Calculator, ArrowRight, MessageSquare, Globe, Loader2 } from 'lucide-react';
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
      title: locale === 'bn' ? '১. অনুরোধ পাঠান' : '1. Submit Request',
      desc: locale === 'bn' ? 'আপনার প্রয়োজনীয় মেশিন এবং বিস্তারিত তথ্য দিন।' : 'Provide your machinery requirements and production capacity.',
    },
    {
      icon: UserCheck,
      title: locale === 'bn' ? '২. বিশেষজ্ঞ পরামর্শ' : '2. Expert Review',
      desc: locale === 'bn' ? 'আমাদের ইঞ্জিনিয়াররা আপনার রিকোয়ারমেন্ট পর্যালোচনা করবেন।' : 'Our technical engineers will review your production needs.',
    },
    {
      icon: Calculator,
      title: locale === 'bn' ? '৩. ফাইনাল কোটেশন' : '3. Final Quote',
      desc: locale === 'bn' ? 'আপনি একটি কাস্টমাইজড মূল্যের কোটেশন পাবেন।' : 'Receive a formal quotation with full technical specs.',
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Industrial Header */}
      <section className="relative py-32 md:py-48 bg-industrial-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/slider3.png')] bg-cover bg-center opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-industrial-dark/50 via-industrial-dark to-industrial-dark" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-0.5 bg-action-orange rounded-full" />
              <span className="text-action-orange font-black uppercase tracking-[0.3em] text-xs">
                Acquisition & Support
              </span>
              <div className="w-12 h-0.5 bg-action-orange rounded-full" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-8">
              Request <span className="text-gray-400">Engineering</span> Quote
            </h1>
            <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
              {locale === 'bn' 
                ? 'মেশিনের বিস্তারিত এবং মূল্য জানতে নিচের ফর্মটি পূরণ করুন।' 
                : 'Accelerate your production with world-class automated machinery.'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-32">
        {/* Modern Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-action-orange transition-colors duration-500">
                <step.icon className="w-8 h-8 text-action-orange group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-black text-industrial-dark uppercase tracking-tight mb-4">{step.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main Form Area */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-[60px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 md:p-16"
          >
            {isSuccess ? (
              <div className="py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">
                    Transmission Successful
                  </h3>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto">
                    Your inquiry has been logged in our system. A technical specialist will contact you shortly.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-10 py-4 bg-industrial-dark text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
                >
                  Send New Inquiry
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Technical Inquiry Form</h2>
                  <p className="text-gray-400 font-medium">Please provide accurate data for precise engineering evaluation.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                      <input 
                        {...register('name')}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all" 
                      />
                      {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone *</label>
                      <input 
                        type="tel" 
                        {...register('phone')}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all" 
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email *</label>
                      <input 
                        type="email" 
                        {...register('email')}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all" 
                      />
                      {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                      <input 
                        {...register('companyName')}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product/Machine Interest *</label>
                    <input 
                      {...register('productInterest')}
                      placeholder="e.g. Automatic Liquid Filling Machine"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all" 
                    />
                    {errors.productInterest && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.productInterest.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Requirements / Scope *</label>
                    <textarea 
                      {...register('message')}
                      rows={5} 
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all resize-none"
                      placeholder="Describe your production capacity, material types, and specific requirements..."
                    />
                    {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full group flex items-center justify-center gap-3 py-5 bg-action-orange text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Deploy Inquiry <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Contact Details Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            {/* WhatsApp Premium Card */}
            <div className="bg-industrial-dark rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-action-orange/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-action-orange/20 transition-all duration-700" />
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                  <MessageSquare className="w-8 h-8 text-action-orange" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tight">Direct Access</h3>
                  <p className="text-white/50 font-medium leading-relaxed">
                    Connect instantly with our industrial sales department via WhatsApp for rapid technical support.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-industrial-dark font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
                >
                  Start Live Chat <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Corporate HQ Info */}
            <div className="bg-gray-50 rounded-[50px] p-12 space-y-12 border border-gray-100">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-industrial-dark uppercase tracking-tight">Corporate HQ</h3>
                <p className="text-gray-400 font-medium text-sm tracking-widest uppercase">Global Headquarters</p>
              </div>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-action-orange" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Office Address</p>
                    <p className="text-industrial-dark font-bold leading-relaxed">{company?.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh'}</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-action-orange" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Lines</p>
                    <a href={`tel:${company?.phone}`} className="text-industrial-dark font-bold hover:text-action-orange transition-colors">
                      {company?.phone || '01631769707, 01818496642'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-action-orange" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Services</p>
                    <a href={`mailto:${company?.email}`} className="text-industrial-dark font-bold hover:text-action-orange transition-colors">
                      {company?.email || 'autopacbd@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-action-orange" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Web Presence</p>
                    <p className="text-industrial-dark font-bold">www.autopacbd.com</p>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 text-action-orange animate-spin" /></div>}>
      <ContactContent />
    </Suspense>
  );
}
