'use client';

import { useEffect, useState } from 'react';

interface Slide {
  id: string;
  titleEn: string;
  titleBn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/hero').then((r) => r.json()).then(setSlides);
  }, []);

  const update = (id: string, field: keyof Slide, value: string | number | boolean) => {
    setSlides((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slides),
    });
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-dark mb-6">Hero Slider</h1>
      <div className="space-y-6">
        {slides.map((s, i) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-6">
            <h3 className="font-medium mb-4">Slide {i + 1}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Title (EN)</label>
                <input value={s.titleEn} onChange={(e) => update(s.id, 'titleEn', e.target.value)} className="w-full px-4 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm mb-1">Title (BN)</label>
                <input value={s.titleBn} onChange={(e) => update(s.id, 'titleBn', e.target.value)} className="w-full px-4 py-2 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Image URL</label>
                <input value={s.imageUrl} onChange={(e) => update(s.id, 'imageUrl', e.target.value)} className="w-full px-4 py-2 border rounded" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={s.isActive} onChange={(e) => update(s.id, 'isActive', e.target.checked)} />
                Active
              </label>
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
