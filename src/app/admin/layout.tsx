'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  FileText
} from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [status, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-action-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const nav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/hero', label: 'Hero Slider', icon: ImageIcon },
    { href: '/admin/partners', label: 'Partners', icon: Users },
    { href: '/admin/industries', label: 'Industries', icon: Briefcase },
    { href: '/admin/blog', label: 'Blog & News', icon: FileText },
    { href: '/admin/quotes', label: 'Quotations', icon: MessageSquare },
    { href: '/admin/company', label: 'Company Info', icon: Settings },
    { href: '/admin/owner', label: 'Owner Profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin" className="text-2xl font-black text-industrial-dark tracking-tight">
            AutoPac <span className="text-action-orange">Admin</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Content Management System</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Menu</div>
          {nav.map((l) => {
            const Icon = l.icon;
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-action-orange/10 text-action-orange' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-industrial-dark'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-action-orange' : 'text-gray-400'}`} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-industrial-dark text-white flex items-center justify-center font-bold text-sm">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-industrial-dark truncate max-w-[120px]">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">{session?.user?.email}</p>
            </div>
          </div>
          
          <Link 
            href="/" 
            target="_blank" 
            className="flex items-center gap-3 py-2 px-3 text-sm font-medium text-gray-600 hover:text-industrial-dark hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            View Live Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 sticky top-0 z-0">
          <h1 className="text-lg font-semibold text-industrial-dark">
            {nav.find(n => n.href === pathname)?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
