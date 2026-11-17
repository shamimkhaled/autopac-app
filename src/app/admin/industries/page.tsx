'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, Loader2, Save, Factory, Globe } from 'lucide-react';

interface Industry {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
}

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/industries')
      .then((r) => r.json())
      .then((data) => setIndustries(Array.isArray(data) ? data : []))
      .catch(() => setIndustries([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Industry, value: string) => {
    setIndustries((i) => i.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const addIndustry = () => {
    setIndustries([
      ...industries,
      { id: `new-${Date.now()}`, slug: '', nameEn: '', nameBn: '', descriptionEn: '', descriptionBn: '' },
    ]);
  };

  const removeIndustry = (id: string) => {
    setIndustries(industries.filter((i) => i.id !== id));
    setStatus({ type: 'ok', text: 'Sector removed from draft. Click Save sectors to apply.' });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/industries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(industries),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Industries updated successfully.' });
      } else {
        setStatus({ type: 'err', text: 'Failed to save industries.' });
      }
    } catch (e) {
      console.error(e);
      setStatus({ type: 'err', text: 'Network error saving industries.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading sectors…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Industries served
          </h2>
          <p className="text-sm text-stone-500 mt-1">Manage sector cards displayed on About & Homepage</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addIndustry} className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add sector
          </button>
          <button type="button" onClick={save} disabled={saving || industries.length === 0} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save sectors'}
          </button>
        </div>
      </div>

      {status && (
        <div
          role="status"
          className={`px-4 py-2.5 rounded-md border text-sm flex items-center gap-2 ${
            status.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.type === 'ok' && <Check className="w-4 h-4" />}
          {status.text}
        </div>
      )}

      <div className="space-y-4">
        {industries.map((ind, idx) => (
          <div key={ind.id} className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <Factory className="w-4 h-4 text-brand-maroon" />
                <h3 className="text-sm font-semibold text-stone-900 tabular-nums">Sector #{idx + 1}</h3>
              </div>
              <button
                type="button"
                onClick={() => removeIndustry(ind.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                aria-label="Remove sector"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="field-label">Sector Name (EN)</label>
                <input
                  value={ind.nameEn}
                  onChange={(e) => update(ind.id, 'nameEn', e.target.value)}
                  placeholder="e.g. Food & Beverage"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Sector Name (BN)</label>
                <input
                  value={ind.nameBn}
                  onChange={(e) => update(ind.id, 'nameBn', e.target.value)}
                  placeholder="বাংলায় নাম..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Slug
                </label>
                <input
                  value={ind.slug}
                  onChange={(e) => update(ind.id, 'slug', e.target.value)}
                  placeholder="e.g. food-beverage"
                  className="input-field font-mono text-xs"
                />
              </div>
              <div className="md:col-span-3">
                <label className="field-label">Description (EN)</label>
                <textarea
                  rows={2}
                  value={ind.descriptionEn || ''}
                  onChange={(e) => update(ind.id, 'descriptionEn', e.target.value)}
                  placeholder="Briefly describe machinery solutions for this sector..."
                  className="input-field py-2.5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {industries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 surface-card border-dashed">
          <Factory className="w-10 h-10 text-stone-300" />
          <p className="text-sm font-medium text-stone-600">No industry sectors configured.</p>
          <button type="button" onClick={addIndustry} className="btn-secondary text-xs">
            Add industry sector
          </button>
        </div>
      )}
    </div>
  );
}
