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
  ShieldCheck,
  Activity,
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
interface RecentLead {
  id: string;
  name: string;
  productInterest: string;
  status: string;
  createdAt: string;
}
interface VisitorData {
  activeVisitors: number;
  topPages: Array<{ page: string; _count: { page: number } }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ products: 0, quotes: 0, partners: 0 });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [visitors, setVisitors] = useState<VisitorData>({ activeVisitors: 0, topPages: [] });
  const [loading, setLoading] = useState(true);
  const [visitorPulse, setVisitorPulse] = useState(false);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/tracker');
      const data = await res.json();
      setVisitors(data);
      setVisitorPulse(true);
      setTimeout(() => setVisitorPulse(false), 400);
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
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          quotes: Array.isArray(quotes) ? quotes.length : 0,
          partners: Array.isArray(partners) ? partners.length : 0,
        });
        setRecentLeads(Array.isArray(quotes) ? quotes.slice(0, 5) : []);
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
      href: '#visitors',
      live: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-brand-maroon text-white rounded-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-2">
              Auto Pac CMS — A2Z
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Website control desk
            </h2>
            <p className="text-white/80 mt-2 text-sm max-w-md">
              Edit the live site from header to footer. Then manage machines, catalog map, and quotations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/website"
              className="btn-primary bg-white text-brand-maroon hover:bg-stone-100"
            >
              Website content
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
              className="inline-flex items-center justify-center min-h-[44px] px-4 border border-white/40 text-white text-sm font-semibold rounded-md hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="surface-card p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold text-stone-900 mb-1">Website A2Z map</h3>
        <p className="text-sm text-stone-500 mb-4">
          Every public surface has an admin screen. Start with Website content for hero → footer copy.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { href: '/admin/website', label: 'Hero, home, catalog band, footer' },
            { href: '/admin/branding', label: 'Brand colors & appearance' },
            { href: '/admin/seo', label: 'SEO, GA4, Open Graph' },
            { href: '/admin/analytics', label: 'Traffic & business analytics' },
            { href: '/admin/hero', label: 'Hero images' },
            { href: '/admin/stats', label: 'Hero counters' },
            { href: '/admin/company', label: 'Logo, phones, WhatsApp, social' },
            { href: '/admin/products', label: 'Machinery catalog' },
            { href: '/admin/catalog', label: 'Brochure page links' },
            { href: '/admin/partners', label: 'Trusted partners' },
            { href: '/admin/testimonials', label: 'Client quotes (About)' },
            { href: '/admin/owner', label: 'Owner / leadership' },
            { href: '/admin/blog', label: 'News articles' },
            { href: '/admin/translations', label: 'Nav & UI EN/BN strings' },
            { href: '/admin/quotes', label: 'Inbound quotations' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2.5 rounded-md border border-stone-200 text-sm text-stone-700 hover:border-brand-maroon hover:text-brand-maroon transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="surface-card surface-card-hover p-5 flex flex-col gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-md bg-brand-paper border border-stone-200 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 text-brand-maroon ${stat.live && visitorPulse ? 'animate-pulse' : ''}`}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="font-display text-3xl font-semibold text-stone-900 tabular-nums">
                    {stat.value}
                  </p>
                  {stat.live ? (
                    <span className="text-[10px] font-semibold uppercase text-emerald-700">Live</span>
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-display text-lg font-semibold text-stone-900">Inbound quotations</h3>
              <p className="text-sm text-stone-500 mt-0.5">Most recent quote requests</p>
            </div>
            <Link href="/admin/quotes" className="btn-ghost text-xs px-2">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentLeads.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-200 rounded-md">
                <p className="text-sm text-stone-500">No quotations yet</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-md border border-stone-100 hover:border-brand-maroon/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-brand-paper border border-stone-200 rounded-md flex items-center justify-center font-semibold text-brand-maroon text-sm flex-shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 text-sm truncate">{lead.name}</p>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5 truncate">
                        <Package className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lead.productInterest}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        lead.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-800 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      }`}
                    >
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div id="visitors" className="surface-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-stone-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-maroon" />
                Live traffic
              </h3>
              <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                Real-time
              </span>
            </div>
            <div className="text-center py-3">
              <p
                className={`font-display text-5xl font-semibold tabular-nums ${
                  visitorPulse ? 'text-brand-maroon' : 'text-stone-900'
                }`}
              >
                {visitors.activeVisitors}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mt-1">
                Active now
              </p>
            </div>
            {visitors.topPages.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Top pages
                </p>
                {visitors.topPages.map(({ page, _count }, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 truncate max-w-[180px]">{page || '/'}</span>
                    <span className="font-semibold text-stone-900 ml-2">{_count.page}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-400">
              <BarChart3 className="w-3 h-3" />
              Updates every 30 seconds
            </p>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-display text-base font-semibold text-stone-900 mb-4">Quick actions</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: '/admin/website', label: 'Edit website copy', icon: Settings },
                { href: '/admin/products/new', label: 'Add machine', icon: Package },
                { href: '/admin/media', label: 'Upload media', icon: ImageIcon },
                { href: '/admin/catalog', label: 'Catalog map', icon: BarChart3 },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-md border border-stone-200 hover:border-brand-maroon transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-brand-paper border border-stone-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand-maroon" />
                  </div>
                  <span className="text-sm font-medium text-stone-800">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-stone-900 text-white p-5 rounded-md space-y-4">
            <h3 className="font-display text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-maroon-mid" /> System
            </h3>
            <div className="space-y-3">
              {[
                { icon: Activity, label: 'Database', status: 'Operational' },
                { icon: Radio, label: 'Visitor track', status: 'Active' },
                { icon: Settings, label: 'CMS', status: 'Live' },
              ].map(({ icon: Icon, label, status }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-brand-maroon-mid" />
                    <span className="text-xs text-white/70">{label}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase text-emerald-400">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
