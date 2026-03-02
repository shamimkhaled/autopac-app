'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin',            label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/products',   label: 'Products',      icon: Package },
  { href: '/admin/hero',       label: 'Hero Slider',   icon: ImageIcon },
  { href: '/admin/partners',   label: 'Partners',      icon: Users },
  { href: '/admin/industries', label: 'Industries',    icon: Briefcase },
  { href: '/admin/stats',      label: 'Legacy Stats',  icon: BarChart3 },
  { href: '/admin/blog',       label: 'Blog & News',   icon: FileText },
  { href: '/admin/quotes',     label: 'Quotations',    icon: MessageSquare },
  { href: '/admin/company',    label: 'Company Info',  icon: Settings },
  { href: '/admin/owner',      label: 'Owner Profile', icon: UserCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [status, pathname, router]);

  // Close sidebar on route change (mobile nav click)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (pathname === '/admin/login') return <>{children}</>;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-action-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const currentPage = NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Dashboard';
  const initials = session.user?.name?.charAt(0).toUpperCase() || 'A';

  const sidebarContent = (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 min-h-[64px]">
        <Link href="/admin" className="text-xl font-black text-industrial-dark tracking-tight flex items-center gap-2" onClick={closeSidebar}>
          AutoPac <span className="text-action-orange">Admin</span>
        </Link>
        <button
          onClick={closeSidebar}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Admin navigation">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-3">Menu</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex items-center gap-3 py-2.5 px-3 rounded-xl font-medium text-sm transition-all
                touch-manipulation group
                ${isActive
                  ? 'bg-action-orange text-white shadow-md shadow-action-orange/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-industrial-dark'
                }
              `}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-industrial-dark'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer — User info + actions */}
      <div className="border-t border-gray-100 p-3 space-y-1 bg-gray-50/50">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-gray-100 mb-2">
          <div className="w-8 h-8 rounded-full bg-industrial-dark text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-industrial-dark text-sm truncate">{session.user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 py-2.5 px-3 text-sm font-medium text-gray-600 hover:text-industrial-dark hover:bg-white rounded-xl transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
          View Live Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 py-2.5 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left touch-manipulation"
        >
          <LogOut className="w-4 h-4 text-red-400 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {sidebarContent}

      {/* Main Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 min-h-[56px] sm:min-h-[64px] flex items-center px-4 sm:px-6 lg:px-8 gap-3">
          {/* Hamburger — mobile/tablet only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 touch-manipulation"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-black text-industrial-dark truncate uppercase tracking-tight">
              {currentPage}
            </h1>
          </div>

          {/* Quick Link to Live Site — tablet/desktop */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-industrial-dark border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Site
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-4 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} Auto Pac — Admin Panel</p>
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank" className="hover:text-gray-600 transition-colors">
                View Website
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="hover:text-red-500 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
