'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateVisitorId(): string {
  try {
    let id = localStorage.getItem('autopac_vid');
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('autopac_vid', id);
    }
    return id;
  } catch {
    return `${Date.now()}-anon`;
  }
}

/** Sends a silent heartbeat every 30 s so the admin dashboard can show live visitor count. */
export default function VisitorBeacon() {
  const pathname = usePathname();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    const ping = () => {
      fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, page: pathname }),
        keepalive: true,
      }).catch(() => {});
    };

    ping(); // immediate ping on page visit / route change
    intervalRef.current = setInterval(ping, 30_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname]);

  return null;
}
