'use client';

import { useLocale } from '@/context/LocaleContext';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="inline-flex items-center bg-brand-paper dark:bg-stone-900 rounded-md p-0.5 border border-stone-200 dark:border-stone-700 shrink-0"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`px-2.5 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
          locale === 'en'
            ? 'bg-white dark:bg-stone-800 text-brand-maroon shadow-sm'
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('bn')}
        aria-pressed={locale === 'bn'}
        className={`px-2.5 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
          locale === 'bn'
            ? 'bg-white dark:bg-stone-800 text-brand-maroon shadow-sm'
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
        }`}
      >
        BN
      </button>
    </div>
  );
}
