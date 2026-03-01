'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useCompany, useOwner } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import { Shield, Award, Users, Settings, Target, Eye, ArrowRight, Quote } from 'lucide-react';

export default function AboutPage() {
  const { locale, t } = useLocale();
  const [company] = useCompany();
  const [owner] = useOwner();

  const stats = [
    { label: 'Years Experience', value: '15+', icon: Award },
    { label: 'Happy Clients', value: '200+', icon: Users },
    { label: 'Machine Models', value: '50+', icon: Settings },
    { label: 'Service Centers', value: '5+', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <section className="relative py-32 md:py-48 bg-industrial-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/slider1.png')] bg-cover bg-center opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-industrial-dark/50 to-industrial-dark" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-0.5 bg-action-orange rounded-full" />
              <span className="text-action-orange font-black uppercase tracking-[0.3em] text-xs">
                About AutoPac
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-8">
              Pioneering <br /> <span className="text-gray-400">Industrial Automation</span>
            </h1>
            <p className="text-white/60 text-xl font-medium max-w-2xl leading-relaxed italic border-l-4 border-action-orange pl-8">
              {locale === 'bn' ? company?.taglineBn : company?.taglineEn}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-action-orange transition-colors duration-500">
                  <Icon className="w-7 h-7 text-action-orange group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-3xl font-black text-industrial-dark mb-1">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-32 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-industrial-dark uppercase tracking-tight leading-tight">
                Manufacturing <span className="text-gray-300">With Purpose</span>
              </h2>
              <div className="w-20 h-2 bg-action-orange rounded-full" />
            </div>
            
            <div className="prose prose-lg text-gray-500 font-medium leading-relaxed max-w-none">
              <p className="whitespace-pre-line">
                {locale === 'bn' ? company?.aboutBn : company?.aboutEn}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest">Our Vision</h4>
                <p className="text-xs text-blue-700/70 font-bold leading-relaxed">
                  {locale === 'bn' ? company?.visionBn : company?.visionEn}
                </p>
              </div>
              <div className="p-8 bg-green-50/50 rounded-3xl border border-green-100 space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-sm font-black text-green-900 uppercase tracking-widest">Our Mission</h4>
                <p className="text-xs text-green-700/70 font-bold leading-relaxed">
                  {locale === 'bn' ? company?.missionBn : company?.missionEn}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl"
          >
            <Image 
              src="/images/slider2.png" 
              alt="AutoPac Factory" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-action-orange/10 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>

      {/* Owner Section */}
      {owner && (
        <section className="py-32 bg-gray-50 border-y border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-action-orange/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-[450px] flex-shrink-0"
              >
                <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white group">
                  <Image 
                    src={owner.photoUrl || '/images/owner.jpg'} 
                    alt={owner.nameEn} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-industrial-dark via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                      {locale === 'bn' ? owner.nameBn : owner.nameEn}
                    </h3>
                    <p className="text-action-orange font-black text-xs uppercase tracking-[0.2em] mt-2">
                      {locale === 'bn' ? owner.titleBn : owner.titleEn}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 space-y-10"
              >
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-industrial-dark uppercase tracking-tight leading-tight">
                    Executive <span className="text-gray-300">Message</span>
                  </h2>
                  <div className="w-20 h-2 bg-action-orange rounded-full" />
                </div>

                <div className="relative">
                  <Quote className="absolute -top-10 -left-10 w-20 h-20 text-gray-100 -z-10" />
                  <p className="text-2xl md:text-3xl font-bold text-industrial-dark leading-relaxed italic">
                    "{locale === 'bn' ? owner.messageBn : owner.messageEn}"
                  </p>
                </div>

                <div className="prose prose-lg text-gray-500 font-medium leading-relaxed max-w-none">
                  <p className="whitespace-pre-line">
                    {locale === 'bn' ? owner.bioBn : owner.bioEn}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <Quote className="w-5 h-5 text-action-orange" />
                  </div>
                  <div>
                    <p className="font-black text-industrial-dark uppercase text-sm">{locale === 'bn' ? owner.nameBn : owner.nameEn}</p>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{locale === 'bn' ? owner.titleBn : owner.titleEn}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-industrial-dark rounded-[60px] p-16 md:p-24 relative overflow-hidden shadow-2xl text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/slider3.png')] opacity-10 grayscale pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-10"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              Ready to <span className="text-action-orange">Automate?</span>
            </h2>
            <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Experience the power of hands-free production with our world-class machinery solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/products"
                className="group flex items-center justify-center gap-3 px-10 py-5 bg-action-orange text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/20"
              >
                Browse Catalog <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl border border-white/10"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
