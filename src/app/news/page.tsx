'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Search, Newspaper, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api, type NewsItem } from '@/lib/api';
import NewsCard from '@/components/News/NewsCard';
import AdSense from '@/components/News/AdSense';
import Script from 'next/script';

// This is a Client Component, but we can still set basic metadata if needed 
// via a parent layout or by using a separate metadata object if this were a Server Component.
// For now, since it's 'use client', metadata is best handled in a layout or via document title.

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'bangladesh' | 'international'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await api.news();
        setNews(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load news:', err);
        setError('Unable to fetch the latest news. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.contentSnippet?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Google AdSense Script - LOADED ONLY ON THIS PAGE */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
      />

      {/* Hero Header */}
      <section className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 py-16 md:py-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-action-orange to-transparent opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-0.5 bg-action-orange rounded-full" />
              <span className="text-action-orange font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                Real-time Insights
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-8"
            >
              Industry <span className="text-gray-300 dark:text-slate-800">& Global</span> News
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
            >
              Stay updated with the latest trends in food processing, packaging, and industrial technology from Bangladesh and around the world.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Content Area (8 columns equivalent) */}
            <div className="flex-1 space-y-12">
              
              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-gray-100 dark:border-slate-800">
                <div className="flex p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                  {[
                    { id: 'all', label: 'All News', icon: Newspaper },
                    { id: 'bangladesh', label: 'Bangladesh', icon: MapPin },
                    { id: 'international', label: 'International', icon: Globe },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id
                          ? 'bg-action-orange text-white shadow-lg shadow-action-orange/20'
                          : 'text-gray-400 hover:text-industrial-dark dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative group min-w-[280px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-action-orange transition-colors" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-action-orange/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* News Grid */}
              {loading ? (
                <div className="py-32 flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-action-orange animate-spin" />
                    <div className="absolute inset-0 bg-action-orange/10 blur-2xl rounded-full" />
                  </div>
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Aggregating Feeds...</p>
                </div>
              ) : error ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sync Failed</h3>
                    <p className="text-gray-500 max-w-sm">{error}</p>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-action-orange transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredNews.map((item, index) => (
                    <div key={index} className="contents">
                      <NewsCard item={item} />
                      {/* Strategic Inline Ads every 4 items */}
                      {(index + 1) % 4 === 0 && (
                        <div className="md:col-span-2">
                          <AdSense slot="inline-news-ad" format="fluid" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 mx-auto rounded-full flex items-center justify-center text-gray-300">
                    <Search className="w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No results matching your query</p>
                </div>
              )}
            </div>

            {/* Sidebar (4 columns equivalent) */}
            <aside className="lg:w-[380px] space-y-10">
              
              {/* Sidebar Ad */}
              <div className="sticky top-[100px] space-y-10">
                <div className="bg-gray-50 dark:bg-slate-900/50 p-1 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
                  <AdSense 
                    slot="sidebar-news-ad" 
                    format="rectangle" 
                    style={{ display: 'block', width: '300px', height: '600px' }} 
                  />
                </div>

                {/* Newsletter Signup (Placeholder) */}
                <div className="bg-industrial-dark p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      Weekly <br /> <span className="text-action-orange">Digest</span>
                    </h3>
                    <p className="text-white/50 text-sm font-medium">
                      Get the most relevant industrial news delivered straight to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-action-orange transition-all"
                      />
                      <button className="w-full py-4 bg-action-orange text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-action-orange/20 hover:bg-orange-600 transition-all">
                        Subscribe
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 translate-x-8" />
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* Bottom Full Width Ad */}
      <section className="py-12 border-t border-gray-50 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <AdSense slot="bottom-banner-ad" format="auto" />
        </div>
      </section>
    </main>
  );
}
