'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, WifiOff } from 'lucide-react';
import { flushQuoteQueue } from '@/lib/quoteQueue';
import { useLocale } from '@/context/LocaleContext';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function PWARegister() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const isAdmin = pathname?.startsWith('/admin');
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [offline, setOffline] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      try {
        if (localStorage.getItem('autopac_pwa_dismissed') === '1') return;
      } catch {
        /* ignore */
      }
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  useEffect(() => {
    const sync = () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine) flushQuoteQueue();
    };
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  if (isAdmin) return null;

  const dismissInstall = () => {
    setShowInstall(false);
    try {
      localStorage.setItem('autopac_pwa_dismissed', '1');
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setShowInstall(false);
    setInstallEvent(null);
  };

  return (
    <>
      {offline && (
        <div className="fixed top-16 sm:top-[72px] inset-x-0 z-[90] bg-stone-900 text-white text-sm px-4 py-2 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" aria-hidden="true" />
          {isBn
            ? 'অফলাইন — সম্প্রতি দেখা মেশিন ও ক্যাটালগ পৃষ্ঠা থাকবে। কোটেশন অনলাইন হলে পাঠানো হবে।'
            : 'Offline — recently viewed machinery and catalog pages stay available. Quotes send when you reconnect.'}
        </div>
      )}
      {showInstall && installEvent && (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-[22rem] z-[45] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md shadow-card p-3 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-white">
              {isBn ? 'অটো প্যাক ইনস্টল করুন' : 'Install Auto Pac'}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {isBn
                ? 'হোম স্ক্রিন থেকে মেশিনারি ও ক্যাটালগ দেখুন।'
                : 'Browse machinery and the catalog from your home screen.'}
            </p>
            <button type="button" onClick={install} className="btn-primary mt-2 h-9 min-h-[36px] text-xs px-3">
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              {isBn ? 'ইনস্টল' : 'Install'}
            </button>
          </div>
          <button
            type="button"
            onClick={dismissInstall}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            aria-label={isBn ? 'বন্ধ করুন' : 'Dismiss install'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
