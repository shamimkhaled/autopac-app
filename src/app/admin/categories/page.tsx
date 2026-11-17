'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save, Layers, Check } from 'lucide-react';

interface CategoryRow {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof CategoryRow, value: string) => {
    setCategories((rows) => rows.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const add = () => {
    setCategories([
      ...categories,
      { id: `new-${Date.now()}`, slug: '', nameEn: '', nameBn: '', descriptionEn: '', descriptionBn: '' },
    ]);
  };

  const remove = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    setStatus({ type: 'ok', text: 'Category staged for removal. Click Save Changes to apply.' });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categories),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Categories updated. Machinery filters now use these names.' });
      } else {
        setStatus({ type: 'err', text: 'Could not save categories.' });
      }
    } catch {
      setStatus({ type: 'err', text: 'Network error while saving categories.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading categories…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Machinery categories
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Category labels appear on machine cards, header mega-menus, and catalog filters.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={add} className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add category
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save changes'}
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
        {categories.map((cat, idx) => (
          <div key={cat.id} className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-brand-maroon" />
                <h3 className="text-sm font-semibold text-stone-900 tabular-nums">
                  Category #{idx + 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => remove(cat.id)}
                className="p-2 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                aria-label="Remove category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Name (English)</label>
                <input
                  value={cat.nameEn}
                  onChange={(e) => update(cat.id, 'nameEn', e.target.value)}
                  placeholder="e.g. Food & Beverage Packaging"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Name (Bengali)</label>
                <input
                  value={cat.nameBn}
                  onChange={(e) => update(cat.id, 'nameBn', e.target.value)}
                  placeholder="নাম (বাংলা)"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Slug</label>
                <input
                  value={cat.slug}
                  onChange={(e) => update(cat.id, 'slug', e.target.value)}
                  placeholder="e.g. food-beverage"
                  className="input-field font-mono text-xs"
                />
              </div>
              <div>
                <label className="field-label">Short Description (EN)</label>
                <input
                  value={cat.descriptionEn || ''}
                  onChange={(e) => update(cat.id, 'descriptionEn', e.target.value)}
                  placeholder="Optional category summary"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
