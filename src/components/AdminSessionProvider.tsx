'use client';

import { SessionProvider } from 'next-auth/react';

/** next-auth session only for /admin — keeps public pages from polling /api/auth/session */
export default function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>;
}
