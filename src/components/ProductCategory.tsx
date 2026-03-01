'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import ProductCard from './ProductCard';
import type { Category, Product } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface ProductCategoryProps {
  category: Category;
  products: Product[];
}

export default function ProductCategory({ category, products }: ProductCategoryProps) {
  const { locale, t } = useLocale();
  
  if (!products || products.length === 0) return null;

  const title = locale === 'bn' ? category.nameBn : category.nameEn;
  const description = locale === 'bn' ? category.descriptionBn : category.descriptionEn;
  const topProducts = products.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 relative">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-5 mb-8"
            >
              <div className="w-14 h-1 bg-action-orange rounded-full" />
              <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px]">
                {locale === 'bn' ? 'মেশিনারি ক্যাটাগরি' : 'Machinery Category'}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-6"
            >
              {title}
            </motion.h2>
            
            {description && (
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-gray-500 dark:text-slate-400 font-bold text-xl md:text-2xl leading-tight uppercase tracking-tight max-w-2xl"
              >
                {description}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="pb-2"
          >
            <Link
              href={`/products?category=${category.slug}`}
              className="group flex items-center gap-5 px-10 py-5 bg-gray-50 dark:bg-slate-900 hover:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-white hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-700 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1"
            >
              View Full Range <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {topProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
