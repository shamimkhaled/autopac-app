'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function SiteSearch({
  compact = false,
  showButton = false,
  inputId,
  tone = 'light',
}: {
  compact?: boolean;
  showButton?: boolean;
  inputId?: string;
  tone?: 'light' | 'onDark';
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const [q, setQ] = useState('');
  const isBn = locale === 'bn';
  const id = inputId || (compact ? 'site-search' : 'machinery-search');
  const onDark = tone === 'onDark';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : '/products');
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={compact ? 'w-full max-w-[220px]' : 'w-full'}
    >
      <label htmlFor={id} className="sr-only">
        {isBn ? 'মেশিন খুঁজুন' : 'Search machinery'}
      </label>
      <div className={`relative ${showButton ? 'flex gap-2 items-stretch' : ''}`}>
        <div className={`relative ${showButton ? 'flex-1' : 'w-full'}`}>
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              onDark ? 'text-stone-500' : 'text-stone-400'
            }`}
            aria-hidden="true"
          />
          <input
            id={id}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isBn ? 'মেশিন বা প্যাক করা পণ্য খুঁজুন' : 'Search a machine or what you pack'}
            className={`w-full pl-9 pr-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/30 focus:border-brand-maroon ${
              compact ? 'h-9' : 'h-12'
            } ${
              onDark
                ? 'bg-white text-stone-900 placeholder:text-stone-500 border-0'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400'
            }`}
          />
        </div>
        {showButton && (
          <button
            type="submit"
            className={onDark ? 'btn-primary bg-brand-maroon flex-shrink-0' : 'btn-primary flex-shrink-0'}
          >
            {isBn ? 'খুঁজুন' : 'Search'}
          </button>
        )}
      </div>
    </form>
  );
}
