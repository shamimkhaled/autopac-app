export type QueuedQuote = {
  name: string;
  phone: string;
  email: string;
  companyName?: string;
  productInterest: string;
  message: string;
  queuedAt: number;
};

const KEY = 'autopac_quote_queue';

export function queueQuote(payload: Omit<QueuedQuote, 'queuedAt'>) {
  try {
    const current: QueuedQuote[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    current.push({ ...payload, queuedAt: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }

  // Ask the service worker to flush when connectivity returns (Chrome/Android)
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((reg) => {
        const syncManager = (
          reg as ServiceWorkerRegistration & {
            sync?: { register: (tag: string) => Promise<void> };
          }
        ).sync;
        if (syncManager) return syncManager.register('autopac-quote-sync');
      })
      .catch(() => {});
  }
}

export async function flushQuoteQueue() {
  if (typeof window === 'undefined' || !navigator.onLine) return;
  let current: QueuedQuote[] = [];
  try {
    current = JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return;
  }
  if (!current.length) return;

  const remaining: QueuedQuote[] = [];
  for (const item of current) {
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(remaining));
  } catch {
    /* ignore */
  }
}
