'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  BarChart3,
  Radio,
  Package,
  MessageSquare,
  Users,
  Quote,
  ExternalLink,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface AnalyticsPayload {
  business: {
    products: number;
    partners: number;
    testimonials: number;
    quotesTotal: number;
    quotesPending: number;
    quotesWeek: number;
    quotesMonth: number;
  };
  traffic: {
    activeVisitors: number;
    topPages: Array<{ page: string | null; _count: { page: number } }>;
  };
  recentQuotes: Array<{
    id: string;
    name: string;
    productInterest: string | null;
    status: string;
    createdAt: string;
  }>;
  marketing: {
    googleAnalyticsId: string;
    facebookPixelId: string;
    googleSiteVerification: string;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading analytics…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="surface-card p-10 text-center text-stone-500">
        Could not load analytics. Check the database connection.
      </div>
    );
  }

  const { business, traffic, recentQuotes, marketing } = data;

  const cards = [
    { label: 'Live visitors', value: traffic.activeVisitors, icon: Radio, href: '#traffic' },
    { label: 'Quotes (pending)', value: business.quotesPending, icon: MessageSquare, href: '/admin/quotes' },
    { label: 'Quotes (7 days)', value: business.quotesWeek, icon: TrendingUp, href: '/admin/quotes' },
    { label: 'Quotes (30 days)', value: business.quotesMonth, icon: BarChart3, href: '/admin/quotes' },
    { label: 'Machines', value: business.products, icon: Package, href: '/admin/products' },
    { label: 'Partners', value: business.partners, icon: Users, href: '/admin/partners' },
    { label: 'Testimonials', value: business.testimonials, icon: Quote, href: '/admin/testimonials' },
    { label: 'Quotes (all)', value: business.quotesTotal, icon: MessageSquare, href: '/admin/quotes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-brand-maroon" />
            Traffic & business analytics
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Live site visitors, quotation pipeline, and Google Analytics connection.
          </p>
        </div>
        <button type="button" onClick={load} className="btn-secondary">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="surface-card surface-card-hover p-4 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-brand-maroon mb-2" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{c.label}</p>
              <p className="font-display text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{c.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section id="traffic" className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-stone-900 mb-1">Live traffic</h2>
          <p className="text-sm text-stone-500 mb-4">Active in the last 3 minutes · updates every 30s</p>
          <p className="font-display text-5xl font-semibold text-brand-maroon tabular-nums">
            {traffic.activeVisitors}
          </p>
          <div className="mt-5 space-y-2 border-t border-stone-100 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Top pages now</p>
            {traffic.topPages.length === 0 ? (
              <p className="text-sm text-stone-500">No active page sessions.</p>
            ) : (
              traffic.topPages.map((row, i) => (
                <div key={i} className="flex justify-between text-sm gap-3">
                  <span className="text-stone-600 truncate">{row.page || '/'}</span>
                  <span className="font-semibold text-stone-900">{row._count.page}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-stone-900 mb-1">Google Analytics</h2>
          <p className="text-sm text-stone-500 mb-4">
            Full journeys, sources, and campaigns live in GA4. This desk shows Auto Pac business signals.
          </p>
          {marketing.googleAnalyticsId ? (
            <p className="text-sm text-stone-800 mb-3">
              Connected ID:{' '}
              <code className="font-mono text-brand-maroon">{marketing.googleAnalyticsId}</code>
            </p>
          ) : (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 mb-3">
              No GA4 ID yet. Add it under SEO & marketing so traffic is measured.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/seo" className="btn-primary text-sm">
              Configure GA / Pixel
            </Link>
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Open GA4 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          {marketing.facebookPixelId && (
            <p className="text-xs text-stone-500 mt-3">
              Facebook Pixel: <code>{marketing.facebookPixelId}</code>
            </p>
          )}
        </section>
      </div>

      <section className="surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-stone-900">Recent quotations</h2>
          <Link href="/admin/quotes" className="btn-ghost text-xs">
            View all
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <p className="text-sm text-stone-500 py-8 text-center">No quotations yet.</p>
        ) : (
          <div className="space-y-2">
            {recentQuotes.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between gap-3 p-3 rounded-md border border-stone-100"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{q.name}</p>
                  <p className="text-xs text-stone-500 truncate">{q.productInterest || '—'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-semibold uppercase text-stone-500">{q.status}</p>
                  <p className="text-[10px] text-stone-400">{new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
