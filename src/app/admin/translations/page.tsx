'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save, Languages } from 'lucide-react';

interface Row {
  id: string;
  key: string;
  valueEn: string;
  valueBn: string;
}

export default function AdminTranslationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/translations')
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Row, value: string) => {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const add = () => {
    setRows([...rows, { id: `new-${Date.now()}`, key: '', valueEn: '', valueBn: '' }]);
  };

  const remove = (id: string) => setRows(rows.filter((r) => r.id !== id));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      if (res.ok) alert('Site copy updated. Refresh the public site to see EN/BN changes.');
      else alert('Could not save translations.');
    } catch {
      alert('Could not save translations.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Site copy (EN / BN)</h1>
          <p className="text-gray-500 font-medium">
            Override public strings. Keys match the dictionary, e.g. <code>products.searchPlaceholder</code>.
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={add} className="flex items-center gap-2 px-6 py-3 bg-industrial-dark text-white font-bold rounded-2xl">
            <Plus className="w-5 h-5" />
            Add string
          </button>
          <button type="button" onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-action-orange text-white font-bold rounded-2xl">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[minmax(8rem,1fr)_1fr_1fr_auto] gap-3 px-4 py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span>Key</span>
          <span>English</span>
          <span>Bengali</span>
          <span />
        </div>
        {rows.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Languages className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No overrides yet. Built-in EN/BN copy still ships. Add a key to replace a string on the website.</p>
          </div>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="grid grid-cols-[minmax(8rem,1fr)_1fr_1fr_auto] gap-3 px-4 py-3 border-t border-gray-100">
              <input
                value={row.key}
                onChange={(e) => update(row.id, 'key', e.target.value)}
                placeholder="nav.products"
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs"
              />
              <input
                value={row.valueEn}
                onChange={(e) => update(row.id, 'valueEn', e.target.value)}
                placeholder="English"
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <input
                value={row.valueBn}
                onChange={(e) => update(row.id, 'valueBn', e.target.value)}
                placeholder="বাংলা"
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <button type="button" onClick={() => remove(row.id)} className="text-gray-300 hover:text-red-500 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
