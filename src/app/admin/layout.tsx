'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = sessionStorage.getItem('admin_token');
    setAuthed(!!token);
    if (!token) router.replace('/admin/login');
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (authed === null) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/hero', label: 'Hero Slider' },
    { href: '/admin/partners', label: 'Trusted Partners' },
    { href: '/admin/company', label: 'Company Profile' },
    { href: '/admin/industries', label: 'Industries' },
    { href: '/admin/owner', label: 'Owner Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-industrial-dark text-white p-4">
        <Link href="/admin" className="text-xl font-bold text-action-orange block mb-6">Auto Pac Admin</Link>
        <nav className="space-y-1">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block py-2 px-3 rounded ${pathname === l.href ? 'bg-action-orange' : 'hover:bg-industrial-charcoal'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/" target="_blank" className="block mt-8 text-sm text-white/70 hover:text-white">View Site →</Link>
        <button
          onClick={() => { sessionStorage.removeItem('admin_token'); router.push('/admin/login'); }}
          className="block mt-2 text-sm text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
