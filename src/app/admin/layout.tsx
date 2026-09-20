'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import AdminSessionProvider from '@/components/AdminSessionProvider';
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Users,
  Settings,
  Briefcase,
  UserCircle,
  LogOut,
  ExternalLink,
  MessageSquare,
  FileText,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Camera,
  BookOpen,
  Layers,
  Languages,
  Quote,
  LayoutTemplate,
  Palette,
  Search,
  LineChart,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/website', label: 'Website content', icon: LayoutTemplate },
  { href: '/admin/branding', label: 'Brand & colors', icon: Palette },
  { href: '/admin/seo', label: 'SEO & marketing', icon: Search },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/products', label: 'Machinery', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/catalog', label: 'Catalog map', icon: BookOpen },
  { href: '/admin/hero', label: 'Hero Slider', icon: ImageIcon },
  { href: '/admin/media', label: 'Media', icon: Camera },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/admin/industries', label: 'Industries', icon: Briefcase },
  { href: '/admin/stats', label: 'Legacy Stats', icon: BarChart3 },
  { href: '/admin/blog', label: 'News & articles', icon: FileText },
  { href: '/admin/quotes', label: 'Quotations', icon: MessageSquare },
  { href: '/admin/company', label: 'Company Info', icon: Settings },
  { href: '/admin/owner', label: 'Owner Profile', icon: UserCircle },
  { href: '/admin/translations', label: 'EN / BN copy', icon: Languages },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminSessionProvider>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [status, pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (pathname === '/admin/login') return <>{children}</>;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-paper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const currentPage =
    NAV_ITEMS.find((n) =>
      n.href === '/admin' ? pathname === '/admin' : pathname === n.href || pathname.startsWith(`${n.href}/`)
    )?.label || 'Dashboard';
  const initials = session.user?.name?.charAt(0).toUpperCase() || 'A';

  const sidebarContent = (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 flex flex-col
        transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200 min-h-[64px]">
        <Link
          href="/admin"
          className="font-display text-lg font-semibold text-stone-900 tracking-tight"
          onClick={closeSidebar}
        >
          Auto Pac <span className="text-brand-maroon">Admin</span>
        </Link>
        <button
          type="button"
          onClick={closeSidebar}
          className="lg:hidden p-2 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5" aria-label="Admin navigation">
        <p className="section-kicker px-3 mb-2">Menu</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex items-center gap-3 py-2.5 px-3 rounded-md text-sm font-medium transition-colors duration-200
                touch-manipulation cursor-pointer
                ${
                  isActive
                    ? 'bg-brand-maroon text-white'
                    : 'text-stone-600 hover:bg-brand-paper hover:text-stone-900'
                }
              `}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-200 p-3 space-y-1 bg-brand-paper/60">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-white border border-stone-200 mb-2">
          <div className="w-8 h-8 rounded-md bg-brand-maroon text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 text-sm truncate">{session.user?.name || 'Admin'}</p>
            <p className="text-xs text-stone-500 truncate">{session.user?.email}</p>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 py-2.5 px-3 text-sm font-medium text-stone-600 hover:text-brand-maroon hover:bg-white rounded-md transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-stone-400 flex-shrink-0" />
          View live site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 py-2.5 px-3 text-sm font-medium text-red-700 hover:bg-red-50 rounded-md transition-colors text-left cursor-pointer touch-manipulation"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-brand-paper">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 z-30 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {sidebarContent}

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200 min-h-[56px] sm:min-h-[64px] flex items-center px-4 sm:px-6 lg:px-8 gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md border border-stone-200 text-stone-700 hover:border-brand-maroon cursor-pointer touch-manipulation"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="section-kicker mb-0.5 hidden sm:block">Admin</p>
            <h1 className="font-display text-lg sm:text-xl font-semibold text-stone-900 truncate tracking-tight">
              {currentPage}
            </h1>
          </div>

          <Link href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex btn-secondary text-xs px-3 h-9 min-h-[36px]">
            <ExternalLink className="w-3.5 h-3.5" />
            Live site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        <footer className="border-t border-stone-200 bg-white px-4 sm:px-6 lg:px-8 py-4 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} Auto Pac — admin</p>
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank" className="hover:text-brand-maroon transition-colors">
                Website
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
