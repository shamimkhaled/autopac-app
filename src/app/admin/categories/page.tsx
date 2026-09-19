'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save, Layers } from 'lucide-react';

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
    if (!confirm('Remove this category? Machines in it stay, but they will need a new category.')) return;
    setCategories(categories.filter((c) => c.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categories),
      });
      if (res.ok) alert('Categories updated. Machinery filters will use these names.');
      else alert('Could not save categories.');
    } catch {
      alert('Could not save categories.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
        <p className="text-gray-500 font-medium uppercase tracking-widest">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Machinery categories</h1>
          <p className="text-gray-500 font-medium">These names appear on machine cards and the Machinery filters.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={add} className="flex items-center gap-2 px-6 py-3 bg-industrial-dark text-white font-bold rounded-2xl">
            <Plus className="w-5 h-5" />
            Add category
          </button>
          <button type="button" onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-action-orange text-white font-bold rounded-2xl">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-action-orange" />
                </div>
                <h3 className="font-black text-industrial-dark uppercase tracking-tight">Category</h3>
              </div>
              <button type="button" onClick={() => remove(cat.id)} className="p-2 text-gray-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={cat.nameEn}
                onChange={(e) => update(cat.id, 'nameEn', e.target.value)}
                placeholder="Name (EN) e.g. Food & Beverage Packaging"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold"
              />
              <input
                value={cat.nameBn}
                onChange={(e) => update(cat.id, 'nameBn', e.target.value)}
                placeholder="নাম (বাংলা)"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold"
              />
              <input
                value={cat.slug}
                onChange={(e) => update(cat.id, 'slug', e.target.value)}
                placeholder="slug e.g. food-beverage"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-sm"
              />
              <input
                value={cat.descriptionEn || ''}
                onChange={(e) => update(cat.id, 'descriptionEn', e.target.value)}
                placeholder="Short description (EN)"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
