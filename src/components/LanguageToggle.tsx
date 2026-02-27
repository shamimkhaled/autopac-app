'use client';

import { useLocale } from '@/context/LocaleContext';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
          locale === 'en'
            ? 'bg-white dark:bg-gray-600 text-action-orange shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-industrial-dark dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('bn')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
          locale === 'bn'
            ? 'bg-white dark:bg-gray-600 text-action-orange shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-industrial-dark dark:hover:text-white'
        }`}
      >
        BN
      </button>
    </div>
  );
}
