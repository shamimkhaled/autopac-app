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
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
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
  const maxPageViews = Math.max(1, ...traffic.topPages.map((row) => row._count.page));
  const resolvedQuotes = Math.max(0, business.quotesTotal - business.quotesPending);

  const cards = [
    { label: 'Live visitors', value: traffic.activeVisitors, icon: Radio, href: '#traffic' },
    { label: 'Quotes (pending)', value: business.quotesPending, icon: MessageSquare, href: '/admin/quotes' },
    { label: 'Quotes (7 days)', value: business.quotesWeek, icon: TrendingUp, href: '/admin/quotes' },
    { label: 'Quotes (30 days)', value: business.quotesMonth, icon: BarChart3, href: '/admin/quotes' },
    { label: 'Machines', value: business.products, icon: Package, href: '/admin/products' },
    { label: 'Partners', value: business.partners, icon: Users, href: '/admin/partners' },
    { label: 'Testimonials', value: business.testimonials, icon: Quote, href: '/admin/testimonials' },
    { label: 'Quotes (all time)', value: business.quotesTotal, icon: MessageSquare, href: '/admin/quotes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-maroon" />
            Traffic & business analytics
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Live site visitors, quotation velocity, top pages, and marketing integrations.
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
        <section id="traffic" className="surface-card p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-stone-900">Live traffic & top routes</h2>
              <p className="text-sm text-stone-500">Active in the last 3 minutes · updates every 30s</p>
            </div>
            <p className="font-display text-4xl font-semibold text-brand-maroon tabular-nums">
              {traffic.activeVisitors}
            </p>
          </div>
          <div className="mt-5 space-y-3 border-t border-stone-200 pt-4">
            {traffic.topPages.length === 0 ? (
              <p className="text-sm text-stone-500">No active page sessions right now.</p>
            ) : (
              traffic.topPages.map((row, i) => {
                const pct = Math.max(6, Math.round((row._count.page / maxPageViews) * 100));
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm gap-3">
                      <span className="text-stone-700 truncate">{row.page || '/'}</span>
                      <span className="font-semibold text-stone-900 tabular-nums shrink-0">{row._count.page}</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-brand-maroon" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-stone-900 mb-1">Lead throughput</h2>
            <p className="text-sm text-stone-500 mb-4">Quotation volume progression</p>
            <div className="space-y-3">
              {[
                { label: 'Last 7 days', value: business.quotesWeek, max: Math.max(1, business.quotesMonth) },
                { label: 'Last 30 days', value: business.quotesMonth, max: Math.max(1, business.quotesTotal) },
                { label: 'Actioned / closed', value: resolvedQuotes, max: Math.max(1, business.quotesTotal) },
                { label: 'Pending review', value: business.quotesPending, max: Math.max(1, business.quotesTotal) },
              ].map((row) => {
                const pct = Math.min(100, Math.round((row.value / Math.max(1, row.max)) * 100));
                return (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-stone-700">
                      <span>{row.label}</span>
                      <span className="tabular-nums font-semibold">{row.value}</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-stone-800" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-stone-900 mb-1">Google Analytics & Pixel</h2>
            <p className="text-sm text-stone-500 mb-4">
              Full journeys, sources, and campaigns live in GA4.
            </p>
            {marketing.googleAnalyticsId ? (
              <p className="text-sm text-stone-800 mb-3">
                Connected ID:{' '}
                <code className="font-mono text-brand-maroon">{marketing.googleAnalyticsId}</code>
              </p>
            ) : (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-3">
                No GA4 ID configured yet. Add one under SEO & marketing.
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
      </div>

      <section className="surface-card p-5 sm:p-6">
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
              <Link
                key={q.id}
                href="/admin/quotes"
                className="flex items-center justify-between gap-3 p-3 rounded-md border border-stone-200 hover:border-brand-maroon transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{q.name}</p>
                  <p className="text-xs text-stone-500 truncate">{q.productInterest || '—'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-maroon">{q.status}</p>
                  <p className="text-[11px] text-stone-400 tabular-nums">{new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
