'use client';

import { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua);
  const chrome = /CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && webkit && !chrome;
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export default function PWAInstallButton({
  variant = 'footer',
}: {
  variant?: 'footer' | 'menu';
}) {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setStandalone(isStandaloneMode());
    setIos(isIosSafari());

    fetch('/api/appearance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.pwa && d.pwa.showInstallButton === false) {
          setEnabled(false);
        }
      })
      .catch(() => {});

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setStandalone(true);
      setDeferredPrompt(null);
      setShowGuide(false);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!enabled || standalone) return null;
  if (!deferredPrompt && !ios) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className={
          variant === 'menu'
            ? 'btn-secondary w-full text-sm whitespace-nowrap'
            : 'inline-flex items-center gap-2 px-3.5 py-2 border border-stone-700 rounded-md text-xs font-semibold text-stone-200 hover:border-white hover:text-white transition-colors whitespace-nowrap shrink-0'
        }
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        {isBn ? 'অ্যাপ ইনস্টল করুন' : 'Install Catalog App'}
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? 'হোম স্ক্রিনে যোগ করুন' : 'Install Auto Pac App'}
          onClick={() => setShowGuide(false)}
        >
          <div
            className="surface-card max-w-sm w-full p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-brand-maroon/10 text-brand-maroon flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-white">
                  {isBn ? 'অটো প্যাক অ্যাপ ইনস্টল' : 'Install Auto Pac App'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isBn
                ? 'Safari ব্রাউজারের নিচে Share (□↑) আইকনে ট্যাপ করে “Add to Home Screen” নির্বাচন করুন। এতে ১২২-পৃষ্ঠার ক্যাটালগ ও মেশিনারি অফলাইনেও দ্রুত চালু হবে।'
                : 'Tap the Share icon (□↑) in Safari, then choose “Add to Home Screen” for fast offline catalog & machinery access.'}
            </p>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="btn-primary w-full"
            >
              {isBn ? 'বুঝেছি' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
