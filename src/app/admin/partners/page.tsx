'use client';

import { useEffect, useState } from 'react';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl?: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/partners').then((r) => r.json()).then(setPartners);
  }, []);

  const update = (id: string, field: keyof Partner, value: string) => {
    setPartners((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/partners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partners),
    });
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-dark mb-6">Trusted Partners</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {partners.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input value={p.name} onChange={(e) => update(p.id, 'name', e.target.value)} className="w-full px-4 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">Logo URL</label>
                <input value={p.logoUrl} onChange={(e) => update(p.id, 'logoUrl', e.target.value)} className="w-full px-4 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">Link URL</label>
                <input value={p.linkUrl || ''} onChange={(e) => update(p.id, 'linkUrl', e.target.value)} className="w-full px-4 py-2 border rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="mt-6 px-6 py-2 bg-action-orange text-white rounded-lg font-medium">
        {saving ? 'Saving...' : 'Save All'}
      </button>
    </div>
  );
}
