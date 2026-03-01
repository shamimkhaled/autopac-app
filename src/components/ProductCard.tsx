'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import { useCategories } from '@/hooks/useSiteData';
import { packableItems } from '@/hooks/useSiteData';
import type { Product } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowRight, Package, MessageSquare } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLocale();
  const [categories] = useCategories();
  const category = product.category || categories.find((c: { id: string }) => c.id === product.categoryId);
  
  let images = [];
  try {
    images = Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);
  } catch (e) {
    console.error(`Error parsing images for product ${product.id}:`, e);
  }
  const mainImage = images[0] || '/images/slider1.png';

  let packables = [];
  try {
    const rawPackables = Array.isArray(product.packableIds) ? product.packableIds : (typeof product.packableIds === 'string' ? JSON.parse(product.packableIds || '[]') : []);
    packables = rawPackables
      .slice(0, 3)
      .map((id: string) => packableItems.find((p) => p.id === id) || { id, nameEn: id, nameBn: id })
      .filter(Boolean);
  } catch (e) {
    console.error(`Error parsing packableIds for product ${product.id}:`, e);
  }

  const name = locale === 'bn' && product.nameBn ? product.nameBn : product.nameEn;
  const shortDesc = locale === 'bn' && product.shortDescBn ? product.shortDescBn : product.shortDescEn;
  const categoryName = category ? (locale === 'bn' && (category as any).nameBn ? (category as any).nameBn : (category as any).nameEn) : 'Machinery';

  return (
    <motion.article 
      whileHover={{ y: -12 }}
      className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-action-orange/5 overflow-hidden transition-all duration-700 group border border-gray-100 dark:border-slate-800 flex flex-col h-full relative"
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-slate-800">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover group-hover:scale-115 transition-transform duration-1000 ease-in-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category Badge */}
        <div className="absolute top-6 left-6 z-10">
          <span className="px-5 py-2 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl border border-white/10">
            {categoryName}
          </span>
        </div>
        {/* Overlay Action */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-action-orange scale-50 group-hover:scale-100 transition-transform duration-700 ease-[0.19,1,0.22,1]">
            <ArrowRight className="w-7 h-7" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 leading-[1.1] uppercase tracking-tighter group-hover:text-action-orange transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-gray-500 dark:text-slate-500 font-medium text-sm line-clamp-2 mb-6 leading-relaxed">
            {shortDesc}
          </p>

          {packables.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {packables.map((p: any) => (
                <span key={p.id} className="text-[9px] font-black text-gray-400 dark:text-slate-600 bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700 uppercase tracking-[0.2em]">
                  {locale === 'bn' ? p.nameBn : p.nameEn}
                </span>
              ))}
              {packables.length > 3 && <span className="text-[9px] font-black text-gray-300 px-2 py-2">+ more</span>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50 dark:border-slate-800">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 flex items-center justify-center gap-3 py-3 px-5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-xl hover:-translate-y-1"
          >
            <Package className="w-4 h-4" />
            Specs
          </Link>
          <a
            href={`https://wa.me/8801818496642?text=${encodeURIComponent(`Hi, I am interested in ${name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 py-3 px-5 bg-action-orange text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-action-orange/20 hover:-translate-y-1"
          >
            <MessageSquare className="w-4 h-4" />
            Quote
          </a>
        </div>
      </div>
    </motion.article>
  );
}
