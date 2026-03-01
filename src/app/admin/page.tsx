'use client';

import { useEffect, useState } from 'react';
import { Package, MessageSquare, Users, Eye, TrendingUp, ArrowRight, Loader2, Plus, FileText, Settings, ShieldCheck, Activity, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardStats {
  products: number;
  quotes: number;
  partners: number;
  views: string;
}

interface RecentLead {
  id: string;
  name: string;
  productInterest: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ products: 0, quotes: 0, partners: 0, views: '0' });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, quotesRes, partnersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/quote'),
          fetch('/api/partners')
        ]);
        
        const products = await productsRes.json();
        const quotes = await quotesRes.json();
        const partners = await partnersRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          quotes: Array.isArray(quotes) ? quotes.length : 0,
          partners: Array.isArray(partners) ? partners.length : 0,
          views: '1.2k' // Placeholder for real analytics
        });

        setRecentLeads(Array.isArray(quotes) ? quotes.slice(0, 5) : []);
      } catch (e) {
        console.error('Dashboard Data Error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Machines', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', href: '/admin/products' },
    { title: 'Active Leads', value: stats.quotes, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', href: '/admin/quotes' },
    { title: 'Global Partners', value: stats.partners, icon: Users, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', href: '/admin/partners' },
    { title: 'Portal Traffic', value: stats.views, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', href: '#' },
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
    <div className="space-y-12">
      {/* Welcome Banner */}
      <div className="relative bg-industrial-dark rounded-[40px] p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-action-orange/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tight">
              Control <span className="text-action-orange">Center</span>
            </h2>
            <p className="text-white/60 font-medium mt-2 max-w-md">
              Welcome back. Your industrial machinery portal is running smoothly with <span className="text-white font-bold">{stats.quotes} active inquiries</span>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/products/new" 
              className="px-8 py-4 bg-white text-industrial-dark font-black rounded-2xl hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
            >
              Deploy Machine
            </Link>
            <Link 
              href="/" 
              target="_blank"
              className="p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
            >
              <ExternalLink className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.title} 
              href={stat.href}
              className={`bg-white p-8 rounded-[32px] shadow-sm border ${stat.border} flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-4xl font-black text-industrial-dark">{stat.value}</h3>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
            <div>
              <h3 className="text-xl font-black text-industrial-dark uppercase tracking-tight">Inbound Leads</h3>
              <p className="text-gray-400 font-medium text-xs mt-1">Most recent quotation requests</p>
            </div>
            <Link href="/admin/quotes" className="flex items-center gap-2 text-xs font-black text-action-orange uppercase tracking-widest hover:translate-x-1 transition-transform">
              Operational View <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold uppercase tracking-widest">No leads recorded yet</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-3xl transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-industrial-dark group-hover:text-action-orange transition-colors">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-industrial-dark text-lg leading-tight">{lead.name}</p>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-1">
                        <Package className="w-3 h-3" /> {lead.productInterest}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      lead.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions & stats */}
        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-industrial-dark uppercase tracking-tight mb-8">Quick Launch</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/products/new" className="flex items-center gap-4 p-5 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Add New Machine</span>
              </Link>
              <Link href="/admin/media" className="flex items-center gap-4 p-5 bg-orange-50/50 hover:bg-orange-50 text-action-orange rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Upload Assets</span>
              </Link>
              <Link href="/admin/blog/new" className="flex items-center gap-4 p-5 bg-purple-50/50 hover:bg-purple-50 text-purple-700 rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Create News</span>
              </Link>
            </div>
          </div>

          <div className="bg-industrial-dark p-10 rounded-[40px] shadow-xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-action-orange/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-action-orange" /> System
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-white/70">Database Status</span>
                </div>
                <span className="text-xs font-black text-green-500 uppercase">Operational</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-action-orange" />
                  <span className="text-sm font-medium text-white/70">CMS Version</span>
                </div>
                <span className="text-xs font-black text-white/40 uppercase">v2.4.0-Enterprise</span>
              </div>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all">
              View Activity Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
