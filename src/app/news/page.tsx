'use client';

import { useEffect, useState, useRef } from 'react';
import { Globe, MapPin, Search, Newspaper, Loader2, AlertCircle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api, type NewsItem } from '@/lib/api';
import NewsCard from '@/components/News/NewsCard';
import AdSense from '@/components/News/AdSense';
import PageHero from '@/components/PageHero';
import Script from 'next/script';

// This is a Client Component, but we can still set basic metadata if needed 
// via a parent layout or by using a separate metadata object if this were a Server Component.
// For now, since it's 'use client', metadata is best handled in a layout or via document title.

type TabId = 'all' | 'bangladesh' | 'international';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const newsletterRef = useRef<HTMLInputElement>(null);
  const [cmsPosts, setCmsPosts] = useState<Array<{
    slug: string;
    titleEn: string;
    titleBn: string;
    contentEn: string;
    imageUrl?: string | null;
    createdAt: string;
  }>>([]);

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage('You\'re subscribed!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Please try again.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMessage('Something went wrong. Please try again.');
    }
  };

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

  // Reset pagination when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const filteredNews = news.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.contentSnippet?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-shell">
      {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
        />
      )}

      <PageHero
        kicker="Industry briefing"
        title="Packaging and processing news"
        description="Trends in food processing, packaging, and industrial equipment from Bangladesh and around the world."
      />

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Content Area (8 columns equivalent) */}
            <div className="flex-1 space-y-12">
              
              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-3 rounded-md border border-stone-200 dark:border-stone-800">
                <div className="flex p-1 bg-stone-50 dark:bg-stone-800 rounded-md overflow-x-auto">
                  {[
                    { id: 'all', label: 'All News', icon: Newspaper },
                    { id: 'bangladesh', label: 'BD News', icon: MapPin },
                    { id: 'international', label: 'Global', icon: Globe },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabId)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-brand-maroon text-white'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative group min-w-[280px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {/* News Grid */}
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
                  <p className="text-stone-400 text-sm">Loading news…</p>
                </div>
              ) : error ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-stone-900 dark:text-white">Unable to load news</h3>
                    <p className="text-gray-500 max-w-sm">{error}</p>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : paginatedNews.length > 0 ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedNews.map((item, index) => (
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

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-10 border-t border-stone-200 dark:border-stone-800">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-md btn-secondary disabled:opacity-30"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const page = i + 1;
                          // Show first, last, current, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-10 h-10 rounded-md text-sm font-semibold ${
                                  currentPage === page
                                    ? 'bg-brand-maroon text-white'
                                    : 'bg-white dark:bg-stone-900 text-stone-500 border border-stone-200 dark:border-stone-700'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return <span key={page} className="text-gray-300">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-md btn-secondary disabled:opacity-30"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <Search className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-stone-500 text-sm">No results matching your query</p>
                </div>
              )}
            </div>

            {/* Sidebar (4 columns equivalent) */}
            <aside className="lg:w-[380px] space-y-10">
              
              {/* Sidebar Ad */}
              <div className="lg:sticky lg:top-[100px] space-y-10">
                <div className="surface-card overflow-hidden">
                  <AdSense 
                    slot="sidebar-news-ad" 
                    format="auto" 
                    style={{ display: 'block', width: '100%', height: 'auto' }} 
                  />
                </div>

                <div className="bg-brand-maroon p-6 sm:p-8 text-white">
                  <div className="space-y-4">
                    <h3 className="font-display text-2xl font-semibold tracking-tight">
                      Weekly digest
                    </h3>
                    <p className="text-white/80 text-sm">
                      Machinery and packaging news, sent to your inbox.
                    </p>

                    {newsletterStatus === 'success' ? (
                      <div className="flex items-center gap-3 py-3 px-4 bg-white/10 border border-white/20 rounded-md">
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                        <span className="text-white text-sm font-medium">{newsletterMessage}</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                        <input
                          ref={newsletterRef}
                          id="newsletter-email"
                          type="email"
                          placeholder="your@email.com"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                          className="w-full h-11 px-3.5 bg-white/10 border border-white/30 rounded-md text-white text-sm outline-none focus:border-white placeholder:text-white/50"
                        />
                        {newsletterStatus === 'error' && (
                          <p className="text-red-200 text-xs px-1">{newsletterMessage}</p>
                        )}
                        <button
                          onClick={handleNewsletterSubmit}
                          disabled={newsletterStatus === 'loading'}
                          className="btn-primary w-full bg-white text-brand-maroon hover:bg-stone-100 disabled:opacity-60"
                        >
                          {newsletterStatus === 'loading' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing...</>
                          ) : (
                            'Subscribe'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* Bottom Full Width Ad */}
      <section className="py-10 border-t border-stone-200 dark:border-stone-800">
        <div className="container mx-auto px-4">
          <AdSense slot="bottom-banner-ad" format="auto" />
        </div>
      </section>
    </main>
  );
}
