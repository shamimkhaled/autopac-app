'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-dark mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/products', label: 'Products', desc: 'Manage product catalog' },
          { href: '/admin/hero', label: 'Hero Slider', desc: 'Edit hero banners' },
          { href: '/admin/partners', label: 'Trusted Partners', desc: 'Manage partner logos' },
          { href: '/admin/company', label: 'Company Profile', desc: 'Contact, logo, tagline' },
          { href: '/admin/industries', label: 'Industries', desc: 'Industries we serve' },
          { href: '/admin/owner', label: 'Owner Profile', desc: 'Leadership section' },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="font-bold text-industrial-dark">{c.label}</h2>
            <p className="text-sm text-industrial-silver mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
