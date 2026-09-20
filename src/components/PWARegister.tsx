'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, RefreshCw, X, WifiOff } from 'lucide-react';
import { flushQuoteQueue } from '@/lib/quoteQueue';
import { useLocale } from '@/context/LocaleContext';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua);
  const chrome = /CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && webkit && !chrome;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export default function PWARegister() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const isAdmin = pathname?.startsWith('/admin');
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [offline, setOffline] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);
  const [updateWaiting, setUpdateWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let regRef: ServiceWorkerRegistration | null = null;
    const onVis = () => {
      if (document.visibilityState === 'visible') regRef?.update().catch(() => {});
    };

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        regRef = reg;
        if (reg.waiting) setUpdateWaiting(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateWaiting(reg.waiting);
            }
          });
        });
      })
      .catch(() => {});

    document.addEventListener('visibilitychange', onVis);

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FLUSH_QUOTE_QUEUE') flushQuoteQueue();
    };
    navigator.serviceWorker.addEventListener('message', onMessage);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      navigator.serviceWorker.removeEventListener('message', onMessage);
    };
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
      if (!isStandalone()) setShowInstall(true);
    };
    const onInstalled = () => {
      setShowInstall(false);
      setShowIosTip(false);
      setInstallEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (isAdmin || isStandalone()) return;
    try {
      if (localStorage.getItem('autopac_pwa_ios_dismissed') === '1') return;
    } catch {
      /* ignore */
    }
    if (isIosSafari()) {
      const t = window.setTimeout(() => setShowIosTip(true), 1800);
      return () => window.clearTimeout(t);
    }
  }, [isAdmin]);

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

  const dismissIos = () => {
    setShowIosTip(false);
    try {
      localStorage.setItem('autopac_pwa_ios_dismissed', '1');
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

  const applyUpdate = () => {
    if (!updateWaiting) return;
    updateWaiting.postMessage({ type: 'SKIP_WAITING' });
    setUpdateWaiting(null);
    window.location.reload();
  };

  return (
    <>
      {offline && (
        <div className="fixed top-16 sm:top-[72px] inset-x-0 z-[90] bg-stone-900 text-white text-sm px-4 py-2 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            {isBn
              ? 'অফলাইন — সম্প্রতি দেখা মেশিন ও ক্যাটালগ পৃষ্ঠা থাকবে। কোটেশন অনলাইন হলে পাঠানো হবে।'
              : 'Offline — recently viewed machinery and catalog pages stay available. Quotes send when you reconnect.'}
          </span>
        </div>
      )}

      {updateWaiting && (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-[22rem] z-[46] bg-stone-900 text-white rounded-md shadow-card p-3 flex items-center gap-3">
          <p className="flex-1 text-sm">
            {isBn ? 'নতুন অ্যাপ আপডেট প্রস্তুত।' : 'A new app update is ready.'}
          </p>
          <button
            type="button"
            onClick={applyUpdate}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-white text-stone-900 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            {isBn ? 'রিফ্রেশ' : 'Refresh'}
          </button>
        </div>
      )}

      {showInstall && installEvent && !updateWaiting && (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-[22rem] z-[45] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md shadow-card p-3 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-white">
              {isBn ? 'অটো প্যাক ইনস্টল করুন' : 'Install Auto Pac'}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {isBn
                ? 'হোম স্ক্রিন থেকে মেশিনারি ও ক্যাটালগ দেখুন — অফলাইনেও।'
                : 'Open machinery and the catalog from your home screen — works offline.'}
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

      {showIosTip && !showInstall && !updateWaiting && !isStandalone() && (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-[22rem] z-[45] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md shadow-card p-3 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-white">
              {isBn ? 'হোম স্ক্রিনে যোগ করুন' : 'Add to Home Screen'}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {isBn
                ? 'শেয়ার বোতাম (□↑) → “Add to Home Screen” চাপুন।'
                : 'Tap Share (□↑), then “Add to Home Screen” for the full app.'}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissIos}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            aria-label={isBn ? 'বন্ধ করুন' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
