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
    setIndustries([...industries, { id: `new-${Date.now()}`, slug: '', nameEn: '', nameBn: '', descriptionEn: '', descriptionBn: '' }]);
  };

  const removeIndustry = (id: string) => {
    if (!confirm('Remove this industry?')) return;
    setIndustries(industries.filter(i => i.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/industries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(industries),
      });
      if (res.ok) alert('Industries updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save industries.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
        <p className="text-gray-500 font-medium uppercase tracking-widest">Loading industry data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Industries Served</h1>
          <p className="text-gray-500 font-medium">Manage sectors and industry-specific content</p>
        </div>
        <button 
          onClick={addIndustry} 
          className="flex items-center gap-2 px-6 py-3 bg-industrial-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Sector
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {industries.map((ind, i) => (
          <div key={ind.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Factory className="w-5 h-5 text-action-orange" />
                </div>
                <h3 className="text-lg font-black text-industrial-dark uppercase tracking-tight">Sector Configuration</h3>
              </div>
              <button 
                onClick={() => removeIndustry(ind.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sector Name (EN)</label>
                <input 
                  value={ind.nameEn} 
                  onChange={(e) => update(ind.id, 'nameEn', e.target.value)} 
                  placeholder="e.g. Food & Beverage"
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-industrial-dark focus:ring-2 focus:ring-action-orange/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sector Name (BN)</label>
                <input 
                  value={ind.nameBn} 
                  onChange={(e) => update(ind.id, 'nameBn', e.target.value)} 
                  placeholder="বাংলায় নাম..."
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-industrial-dark focus:ring-2 focus:ring-action-orange/20 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> Slug (URL Identifier)
                </label>
                <input 
                  value={ind.slug} 
                  onChange={(e) => update(ind.id, 'slug', e.target.value)} 
                  placeholder="e.g. food-beverage"
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-xs text-gray-500 focus:ring-2 focus:ring-action-orange/20 outline-none" 
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (EN)</label>
                <textarea 
                  value={ind.descriptionEn || ''} 
                  onChange={(e) => update(ind.id, 'descriptionEn', e.target.value)} 
                  placeholder="Briefly describe solutions for this sector..."
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-sm text-gray-600 focus:ring-2 focus:ring-action-orange/20 outline-none resize-none" 
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {industries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <Factory className="w-16 h-16 opacity-20" />
          <p className="text-xl font-bold opacity-50 uppercase tracking-tight">No industries defined</p>
          <button onClick={addIndustry} className="px-8 py-3 bg-industrial-dark text-white font-bold rounded-2xl">Add Industry Sector</button>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button 
          onClick={save} 
          disabled={saving || industries.length === 0} 
          className="flex items-center gap-3 px-10 py-4 bg-action-orange text-white font-black rounded-3xl shadow-xl shadow-action-orange/30 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {saving ? 'Processing...' : 'Save Sector Database'}
        </button>
      </div>
    </div>
  );
}
