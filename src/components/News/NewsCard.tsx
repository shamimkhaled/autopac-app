'use client';

import { ExternalLink, Calendar, Globe, MapPin } from 'lucide-react';
import type { NewsItem } from '@/lib/api';

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
    <article className="group surface-card overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-100 dark:bg-stone-800">
        {item.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 dark:text-stone-600">
            <Globe className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 bg-white/95 dark:bg-stone-950/90 text-[10px] font-semibold uppercase tracking-wider text-stone-800 dark:text-white">
            {item.source}
          </span>
          <span className="px-2 py-0.5 bg-brand-maroon text-white text-[10px] font-semibold uppercase tracking-wider">
            {item.category === 'bangladesh' ? (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> BD</span>
            ) : (
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global</span>
            )}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
          <Calendar className="w-3 h-3" />
          {date}
        </div>

        <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-brand-maroon transition-colors">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>

        <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-3 mb-5 leading-relaxed flex-1">
          {item.contentSnippet}
        </p>

        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200 hover:text-brand-maroon"
          >
            Read article <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
