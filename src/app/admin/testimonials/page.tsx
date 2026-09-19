'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save, Star } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';

interface Testimonial {
  id: string;
  nameEn: string;
  nameBn: string;
  company?: string;
  designation?: string;
  messageEn: string;
  messageBn: string;
  rating: number;
  imageUrl?: string;
  isActive: boolean;
}

const empty = (): Testimonial => ({
  id: `new-${Date.now()}`,
  nameEn: '',
  nameBn: '',
  company: '',
  designation: '',
  messageEn: '',
  messageBn: '',
  rating: 5,
  imageUrl: '',
  isActive: true,
});

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerId, setPickerId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, patch: Partial<Testimonial>) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (res.ok) {
        const refreshed = await fetch('/api/admin/testimonials').then((r) => r.json());
        if (Array.isArray(refreshed)) setItems(refreshed);
        alert('Testimonials saved. Active ones appear on the About page.');
      } else {
        alert('Could not save testimonials.');
      }
    } catch {
      alert('Could not save testimonials.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading testimonials…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Client testimonials
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Factory-floor quotes in English and Bengali. Toggle active to show on About.
          </p>
        </div>
        <button type="button" onClick={() => setItems([...items, empty()])} className="btn-secondary">
          <Plus className="w-4 h-4" />
          Add testimonial
        </button>
      </div>

      <div className="space-y-4">
        {items.map((t, i) => (
          <div key={t.id} className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-sm text-brand-maroon tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.isActive}
                    onChange={(e) => update(t.id, { isActive: e.target.checked })}
                    className="rounded border-stone-300 text-brand-maroon focus:ring-brand-maroon"
                  />
                  Active on site
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Remove this testimonial?')) {
                      setItems(items.filter((x) => x.id !== t.id));
                    }
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 cursor-pointer"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Name (EN)
                </label>
                <input
                  value={t.nameEn}
                  onChange={(e) => update(t.id, { nameEn: e.target.value })}
                  className="input-field mt-1"
                  placeholder="e.g. Karim Rahman"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Name (BN)
                </label>
                <input
                  value={t.nameBn}
                  onChange={(e) => update(t.id, { nameBn: e.target.value })}
                  className="input-field mt-1"
                  placeholder="নাম"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Company
                </label>
                <input
                  value={t.company || ''}
                  onChange={(e) => update(t.id, { company: e.target.value })}
                  className="input-field mt-1"
                  placeholder="Factory / brand"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Role
                </label>
                <input
                  value={t.designation || ''}
                  onChange={(e) => update(t.id, { designation: e.target.value })}
                  className="input-field mt-1"
                  placeholder="Plant manager"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Message (EN)
                </label>
                <textarea
                  value={t.messageEn}
                  onChange={(e) => update(t.id, { messageEn: e.target.value })}
                  rows={3}
                  className="input-field mt-1 h-auto py-2.5"
                  placeholder="What they say about the machine or service…"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Message (BN)
                </label>
                <textarea
                  value={t.messageBn}
                  onChange={(e) => update(t.id, { messageBn: e.target.value })}
                  rows={3}
                  className="input-field mt-1 h-auto py-2.5"
                  placeholder="বাংলায় মন্তব্য…"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-maroon" />
                <label className="text-sm text-stone-600">Rating</label>
                <select
                  value={t.rating}
                  onChange={(e) => update(t.id, { rating: Number(e.target.value) })}
                  className="input-field w-20 h-9"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={() => setPickerId(t.id)} className="btn-ghost text-xs">
                {t.imageUrl ? 'Change photo' : 'Add photo'}
              </button>
              {t.imageUrl && (
                <span className="text-xs text-stone-500 truncate max-w-[200px]">{t.imageUrl}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="surface-card p-12 text-center border-dashed">
          <p className="text-stone-500 text-sm">No testimonials yet.</p>
          <button type="button" onClick={() => setItems([empty()])} className="btn-primary mt-4">
            Add first testimonial
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save testimonials'}
        </button>
      </div>

      {pickerId && (
        <MediaPicker
          onSelect={(url) => {
            update(pickerId, { imageUrl: url });
            setPickerId(null);
          }}
          onClose={() => setPickerId(null)}
          selectedUrl={items.find((t) => t.id === pickerId)?.imageUrl}
        />
      )}
    </div>
  );
}
