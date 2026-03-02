'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Globe, MapPin } from 'lucide-react';
import type { NewsItem } from '@/lib/api';
import Image from 'next/image';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const date = new Date(item.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-slate-800">
        {item.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-700">
            <Globe className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg text-industrial-dark dark:text-white border border-gray-100 dark:border-slate-700">
            {item.source}
          </span>
          <span className={`px-3 py-1 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg text-white border border-white/20 ${
            item.category === 'bangladesh' ? 'bg-orange-500/90' : 'bg-blue-500/90'
          }`}>
            {item.category === 'bangladesh' ? (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> BD</span>
            ) : (
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global</span>
            )}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
          <Calendar className="w-3 h-3" />
          {date}
        </div>
        
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-action-orange transition-colors">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>
        
        <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
          {item.contentSnippet}
        </p>

        <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-industrial-dark dark:text-slate-300 hover:text-action-orange dark:hover:text-action-orange transition-all"
          >
            Read Full Article <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
