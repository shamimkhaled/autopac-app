'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Package, MessageSquare, Users, Eye, TrendingUp, ArrowRight, Loader2,
  FileText, Settings, ShieldCheck, Activity, ExternalLink, Image as ImageIcon,
  Radio, BarChart3, Globe
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats { products: number; quotes: number; partners: number; }
interface RecentLead { id: string; name: string; productInterest: string; status: string; createdAt: string; }
interface VisitorData { activeVisitors: number; topPages: Array<{ page: string; _count: { page: number } }> }

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
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, quotesRes, partnersRes] = await Promise.all([
          fetch('/api/products'), fetch('/api/quote'), fetch('/api/partners'),
        ]);
        const [products, quotes, partners] = await Promise.all([
          productsRes.json(), quotesRes.json(), partnersRes.json(),
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
    { title: 'Total Machines',  value: stats.products, icon: Package,      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   href: '/admin/products' },
    { title: 'Active Leads',    value: stats.quotes,   icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', href: '/admin/quotes' },
    { title: 'Global Partners', value: stats.partners, icon: Users,         color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100',  href: '/admin/partners' },
    { title: 'Live Visitors',   value: visitors.activeVisitors, icon: Radio, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', href: '#visitors' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 className="w-16 h-16 text-action-orange animate-spin" />
        <div className="text-center">
          <p className="text-xl font-black text-industrial-dark uppercase tracking-widest animate-pulse">Initializing Control Center...</p>
          <p className="text-gray-400 font-medium mt-1">Establishing secure connection to database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Welcome Banner */}
      <div className="relative bg-industrial-dark rounded-3xl sm:rounded-[40px] p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-action-orange/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight">
              Control <span className="text-action-orange">Center</span>
            </h2>
            <p className="text-white/60 font-medium mt-2 max-w-md text-sm">
              Your industrial machinery portal is running.{' '}
              <span className="text-white font-bold">{stats.quotes} active inquiries</span> await review.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products/new" className="px-5 sm:px-8 py-3 sm:py-4 bg-white text-industrial-dark font-black rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-lg text-xs uppercase tracking-wider">
              Add Machine
            </Link>
            <Link href="/" target="_blank" className="p-3 sm:p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10">
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isLive = stat.title === 'Live Visitors';
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className={`bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border ${stat.border} flex flex-col gap-4 sm:gap-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group`}
            >
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${stat.color} ${isLive && visitorPulse ? 'animate-ping' : ''}`} />
              </div>
              <div>
                <p className="text-[9px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className={`text-2xl sm:text-4xl font-black text-industrial-dark tabular-nums transition-all ${isLive && visitorPulse ? 'text-purple-600 scale-105' : ''}`}>
                    {stat.value}
                  </h3>
                  {isLive ? (
                    <span className="flex items-center gap-1 text-[9px] font-black text-green-500 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 sm:mb-10 border-b border-gray-50 pb-4 sm:pb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-industrial-dark uppercase tracking-tight">Inbound Leads</h3>
              <p className="text-gray-400 font-medium text-xs mt-0.5">Most recent quotation requests</p>
            </div>
            <Link href="/admin/quotes" className="flex items-center gap-1.5 text-xs font-black text-action-orange uppercase tracking-widest hover:translate-x-1 transition-transform">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <div className="text-center py-14 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No leads yet</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 sm:p-5 bg-gray-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl sm:rounded-3xl transition-all group">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-industrial-dark group-hover:text-action-orange transition-colors text-sm flex-shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-industrial-dark text-sm truncate">{lead.name}</p>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                        <Package className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lead.productInterest}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      lead.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>{lead.status}</span>
                    <span className="text-[9px] text-gray-400 font-bold">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 sm:space-y-8">
          {/* Live Visitor Widget */}
          <div id="visitors" className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[36px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-industrial-dark uppercase tracking-tight text-sm sm:text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                Live Traffic
              </h3>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Real-time
              </span>
            </div>

            <div className="text-center py-4">
              <div className={`text-5xl sm:text-6xl font-black tabular-nums transition-all duration-300 ${visitorPulse ? 'text-purple-600 scale-110' : 'text-industrial-dark'}`}>
                {visitors.activeVisitors}
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Active Users Now</p>
            </div>

            {visitors.topPages.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-gray-50 pt-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Top Pages</p>
                {visitors.topPages.map(({ page, _count }, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 truncate max-w-[140px] font-medium">{page || '/'}</span>
                    <span className="font-black text-industrial-dark flex-shrink-0 ml-2">{_count.page}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-[9px] text-gray-300 font-bold">
              <BarChart3 className="w-3 h-3" />
              Updates every 30 seconds
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[36px] shadow-sm border border-gray-100">
            <h3 className="text-sm sm:text-base font-black text-industrial-dark uppercase tracking-tight mb-5">Quick Launch</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { href: '/admin/products/new', label: 'Add New Machine',  icon: Package,     bg: 'bg-blue-50/50 hover:bg-blue-50 text-blue-700' },
                { href: '/admin/media',        label: 'Upload Assets',    icon: ImageIcon,   bg: 'bg-orange-50/50 hover:bg-orange-50 text-action-orange' },
                { href: '/admin/stats',        label: 'Edit Counters',    icon: BarChart3,   bg: 'bg-green-50/50 hover:bg-green-50 text-green-700' },
                { href: '/admin/company',      label: 'Company Settings', icon: Settings,    bg: 'bg-purple-50/50 hover:bg-purple-50 text-purple-700' },
              ].map(({ href, label, icon: Icon, bg }) => (
                <Link key={href} href={href} className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl transition-all group ${bg}`}>
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-industrial-dark p-6 sm:p-8 rounded-3xl sm:rounded-[36px] shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-action-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-action-orange" /> System Status
            </h3>
            <div className="space-y-3.5">
              {[
                { icon: Activity, label: 'Database',      status: 'Operational', color: 'text-green-500' },
                { icon: Radio,    label: 'Visitor Track', status: 'Active',      color: 'text-green-500' },
                { icon: Settings, label: 'CMS Version',   status: 'v2.5.0',     color: 'text-white/40' },
              ].map(({ icon: Icon, label, status, color }) => (
                <div key={label} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-action-orange" />
                    <span className="text-xs font-medium text-white/70">{label}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase ${color}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
