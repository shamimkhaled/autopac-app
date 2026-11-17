'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Package,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowRight,
  Loader2,
  Settings,
  ExternalLink,
  Image as ImageIcon,
  Radio,
  BarChart3,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  products: number;
  quotes: number;
  partners: number;
}
interface QuoteRow {
  id: string;
  name: string;
  companyName?: string;
  productInterest: string;
  status: 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED' | string;
  createdAt: string;
}
interface VisitorData {
  activeVisitors: number;
  topPages: Array<{ page: string; _count: { page: number } }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ products: 0, quotes: 0, partners: 0 });
  const [allQuotes, setAllQuotes] = useState<QuoteRow[]>([]);
  const [visitors, setVisitors] = useState<VisitorData>({ activeVisitors: 0, topPages: [] });
  const [loading, setLoading] = useState(true);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/tracker');
      const data = await res.json();
      setVisitors(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, quotesRes, partnersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/quote'),
          fetch('/api/partners'),
        ]);
        const [products, quotes, partners] = await Promise.all([
          productsRes.json(),
          quotesRes.json(),
          partnersRes.json(),
        ]);
        const quoteList = Array.isArray(quotes) ? quotes : [];
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          quotes: quoteList.length,
          partners: Array.isArray(partners) ? partners.length : 0,
        });
        setAllQuotes(quoteList);
      } catch (e) {
        console.error('Dashboard Data Error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 30_000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  const recentLeads = allQuotes.slice(0, 6);
  const pipelineCounts = {
    PENDING: allQuotes.filter((q) => q.status === 'PENDING').length,
    REVIEWED: allQuotes.filter((q) => q.status === 'REVIEWED').length,
    RESPONDED: allQuotes.filter((q) => q.status === 'RESPONDED').length,
    CLOSED: allQuotes.filter((q) => q.status === 'CLOSED').length,
  };
  const totalQuotes = Math.max(1, allQuotes.length);
  const maxTopViews = Math.max(1, ...visitors.topPages.map((p) => p._count.page));

  const statCards = [
    {
      title: 'Machines',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'Quotations',
      value: stats.quotes,
      icon: MessageSquare,
      href: '/admin/quotes',
      note: `${pipelineCounts.PENDING} pending`,
    },
    {
      title: 'Partners',
      value: stats.partners,
      icon: Users,
      href: '/admin/partners',
    },
    {
      title: 'Live visitors',
      value: visitors.activeVisitors,
      icon: Radio,
      href: '/admin/analytics',
      live: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-brand-maroon text-white rounded-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 mb-2">
              Auto Pac CMS · Operations Desk
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Website & Quotation Control Desk
            </h2>
            <p className="text-white/85 mt-2 text-sm max-w-lg">
              Manage public website copy, industrial machinery specs, brochure catalog links, and incoming client quotation requests.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/quotes"
              className="btn-primary bg-white text-brand-maroon hover:bg-stone-100"
            >
              Review quotes
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center min-h-[44px] px-4 border border-white/40 text-white text-sm font-semibold rounded-md hover:bg-white/10"
            >
              Add machine
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center min-h-[44px] px-3.5 border border-white/40 text-white text-sm font-semibold rounded-md hover:bg-white/10"
              title="Open live website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="surface-card surface-card-hover p-5 flex flex-col gap-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md bg-brand-paper border border-stone-200 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-brand-maroon" />
                </div>
                {stat.live ? (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    Active
                  </span>
                ) : stat.note ? (
                  <span className="text-xs font-medium text-brand-maroon tabular-nums">{stat.note}</span>
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  {stat.title}
                </p>
                <p className="font-display text-3xl font-semibold text-stone-900 mt-0.5 tabular-nums">
                  {stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Status Pipeline Breakdown */}
          <div className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-900">Quotation pipeline</h3>
                <p className="text-sm text-stone-500">Distribution across current lead stages</p>
              </div>
              <Link href="/admin/quotes" className="btn-ghost text-xs px-2">
                Open pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'PENDING', label: 'Pending', count: pipelineCounts.PENDING, bar: 'bg-amber-500' },
                { key: 'REVIEWED', label: 'Reviewed', count: pipelineCounts.REVIEWED, bar: 'bg-sky-600' },
                { key: 'RESPONDED', label: 'Responded', count: pipelineCounts.RESPONDED, bar: 'bg-brand-maroon' },
                { key: 'CLOSED', label: 'Closed', count: pipelineCounts.CLOSED, bar: 'bg-emerald-600' },
              ].map((stage) => {
                const pct = allQuotes.length === 0 ? 0 : Math.round((stage.count / totalQuotes) * 100);
                return (
                  <div key={stage.key} className="p-3 rounded-md border border-stone-200 bg-brand-paper/40">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-medium text-stone-600">{stage.label}</span>
                      <span className="text-xs font-semibold text-stone-400 tabular-nums">{pct}%</span>
                    </div>
                    <p className="font-display text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
                      {stage.count}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-stone-200 rounded-sm overflow-hidden">
                      <div className={`h-full ${stage.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inbound quotations table */}
          <div className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-900">Recent quotations</h3>
                <p className="text-sm text-stone-500">Latest factory inquiries</p>
              </div>
              <Link href="/admin/quotes" className="btn-ghost text-xs px-2">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentLeads.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-stone-200 rounded-md">
                  <p className="text-sm text-stone-500">No quotations received yet.</p>
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href="/admin/quotes"
                    className="flex items-center justify-between p-3 rounded-md border border-stone-200 hover:border-brand-maroon transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-brand-paper border border-stone-200 rounded-md flex items-center justify-center font-semibold text-brand-maroon text-sm flex-shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-stone-900 text-sm truncate">
                          {lead.name}
                          {lead.companyName ? ` · ${lead.companyName}` : ''}
                        </p>
                        <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5 truncate">
                          <Package className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{lead.productInterest || 'General inquiry'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          lead.status === 'PENDING'
                            ? 'text-amber-700'
                            : lead.status === 'CLOSED'
                            ? 'text-emerald-700'
                            : 'text-brand-maroon'
                        }`}
                      >
                        {lead.status}
                      </span>
                      <span className="text-[11px] text-stone-400 tabular-nums">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div id="visitors" className="surface-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-semibold text-stone-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-maroon" />
                Active traffic
              </h3>
              <Link href="/admin/analytics" className="text-xs font-medium text-brand-maroon hover:underline">
                Details
              </Link>
            </div>
            <div className="py-2 border-b border-stone-100">
              <p className="font-display text-4xl font-semibold text-stone-900 tabular-nums">
                {visitors.activeVisitors}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">Visitors active in last 3 minutes</p>
            </div>
            {visitors.topPages.length > 0 && (
              <div className="mt-4 space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Top routes
                </p>
                {visitors.topPages.map(({ page, _count }, i) => {
                  const pct = Math.max(8, Math.round((_count.page / maxTopViews) * 100));
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="text-stone-700 truncate">{page || '/'}</span>
                        <span className="font-semibold text-stone-900 tabular-nums shrink-0">
                          {_count.page}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 rounded-sm overflow-hidden">
                        <div className="h-full bg-brand-maroon" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="surface-card p-5">
            <h3 className="font-display text-base font-semibold text-stone-900 mb-3">Quick actions</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: '/admin/website', label: 'Edit website copy', icon: Settings },
                { href: '/admin/products/new', label: 'Add new machine', icon: Package },
                { href: '/admin/media', label: 'Upload media library', icon: ImageIcon },
                { href: '/admin/catalog', label: 'Brochure catalog map', icon: BarChart3 },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-2.5 rounded-md border border-stone-200 hover:border-brand-maroon transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-brand-paper border border-stone-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand-maroon" />
                  </div>
                  <span className="text-sm font-medium text-stone-800">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-display text-base font-semibold text-stone-900 mb-3">Website A2Z pages</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { href: '/admin/company', label: 'Company info' },
                { href: '/admin/branding', label: 'Brand & colors' },
                { href: '/admin/seo', label: 'SEO & GA4' },
                { href: '/admin/hero', label: 'Hero slider' },
                { href: '/admin/partners', label: 'Partners' },
                { href: '/admin/testimonials', label: 'Testimonials' },
                { href: '/admin/blog', label: 'News articles' },
                { href: '/admin/translations', label: 'EN / BN copy' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-2 rounded-md border border-stone-200 text-xs font-medium text-stone-700 hover:border-brand-maroon hover:text-brand-maroon transition-colors truncate"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
