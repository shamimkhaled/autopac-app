'use client';

import { useLocale } from '@/context/LocaleContext';
import { usePartners } from '@/hooks/useSiteData';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TrustedPartners() {
  const { t } = useLocale();
  const [partners, loaded] = usePartners();

  if (loaded && partners.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-black text-industrial-dark uppercase tracking-tight"
          >
            Trusted by <span className="text-action-orange">Industry Leaders</span>
          </motion.h2>
          <div className="w-12 h-1 bg-action-orange mx-auto mt-2 rounded-full" />
        </div>

        <div className="relative group">
          {/* Logo Track - Infinite Scroll Effect */}
          <div className="flex overflow-hidden group">
            <motion.div 
              className="flex gap-16 py-4 items-center"
              animate={{
                x: [0, -1035], // Adjust based on total width of logos
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <div 
                  key={`${partner.id}-${index}`} 
                  className="w-40 h-24 relative flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 flex items-center justify-center p-4 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50"
                >
                  {partner.logoUrl ? (
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest text-center">{partner.name}</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Faded edges for better transition */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
