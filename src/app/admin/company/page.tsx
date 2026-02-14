'use client';

import { useEffect, useState } from 'react';

export default function AdminCompanyPage() {
  const [form, setForm] = useState({
    logoUrl: '',
    taglineEn: '',
    taglineBn: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    officeHours: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/company').then((r) => r.json()).then((d) => {
      if (d) setForm((f) => ({ ...f, ...d }));
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-dark mb-6">Company Profile</h1>
      <form onSubmit={save} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Logo URL</label>
          <input value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tagline (EN)</label>
          <input value={form.taglineEn} onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tagline (BN)</label>
          <input value={form.taglineBn} onChange={(e) => setForm((f) => ({ ...f, taglineBn: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp (number only)</label>
          <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Office Hours</label>
          <input value={form.officeHours} onChange={(e) => setForm((f) => ({ ...f, officeHours: e.target.value }))} className="w-full px-4 py-2 border rounded" />
        </div>
        <button type="submit" disabled={saving} className="px-6 py-2 bg-action-orange text-white rounded-lg font-medium">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
