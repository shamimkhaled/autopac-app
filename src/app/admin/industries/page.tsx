'use client';

import { useEffect, useState } from 'react';

interface Industry {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
}

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/industries').then((r) => r.json()).then(setIndustries);
  }, []);

  const update = (id: string, field: string, value: string) => {
    setIndustries((i) => i.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/industries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(industries),
    });
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-dark mb-6">Industries</h1>
      <div className="space-y-4">
        {industries.map((i) => (
          <div key={i.id} className="bg-white rounded-xl shadow p-6 flex gap-4 flex-wrap">
            <input value={i.nameEn} onChange={(e) => update(i.id, 'nameEn', e.target.value)} placeholder="Name (EN)" className="flex-1 min-w-[200px] px-4 py-2 border rounded" />
            <input value={i.nameBn} onChange={(e) => update(i.id, 'nameBn', e.target.value)} placeholder="Name (BN)" className="flex-1 min-w-[200px] px-4 py-2 border rounded" />
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="mt-6 px-6 py-2 bg-action-orange text-white rounded-lg font-medium">
        {saving ? 'Saving...' : 'Save All'}
      </button>
    </div>
  );
}
