'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save, Languages, Download } from 'lucide-react';
import { translations } from '@/data/translations';

interface Row {
  id: string;
  key: string;
  valueEn: string;
  valueBn: string;
}

function flattenDict(
  obj: Record<string, unknown>,
  prefix = ''
): Array<{ key: string; valueEn: string }> {
  const out: Array<{ key: string; valueEn: string }> = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flattenDict(v as Record<string, unknown>, path));
    } else if (typeof v === 'string') {
      out.push({ key: path, valueEn: v });
    }
  }
  return out;
}

function defaultRows(): Row[] {
  const enFlat = flattenDict(translations.en as unknown as Record<string, unknown>);
  const bnFlat = flattenDict(translations.bn as unknown as Record<string, unknown>);
  const bnMap = Object.fromEntries(bnFlat.map((r) => [r.key, r.valueEn]));
  return enFlat.map((r, i) => ({
    id: `seed-${i}-${r.key}`,
    key: r.key,
    valueEn: r.valueEn,
    valueBn: bnMap[r.key] || '',
  }));
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

  const loadDefaults = () => {
    if (
      rows.length > 0 &&
      !confirm('Replace the current list with built-in EN/BN defaults? Unsaved edits will be lost.')
    ) {
      return;
    }
    const existingByKey = Object.fromEntries(rows.map((r) => [r.key, r]));
    const seeded = defaultRows().map((d) => {
      const existing = existingByKey[d.key];
      if (existing && !String(existing.id).startsWith('seed-') && !String(existing.id).startsWith('new-')) {
        return existing;
      }
      return existing
        ? { ...d, id: existing.id.startsWith('new-') || existing.id.startsWith('seed-') ? d.id : existing.id }
        : d;
    });
    // Keep custom keys that aren't in defaults
    const defaultKeys = new Set(seeded.map((r) => r.key));
    const custom = rows.filter((r) => r.key && !defaultKeys.has(r.key));
    setRows([...seeded, ...custom]);
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
      if (res.ok) {
        const refreshed = await fetch('/api/admin/translations').then((r) => r.json());
        if (Array.isArray(refreshed)) setRows(refreshed);
        alert('Site copy updated. Refresh the public site to see EN/BN changes.');
      } else alert('Could not save translations.');
    } catch {
      alert('Could not save translations.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Site copy (EN / BN)
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Override nav, product UI, contact form labels, and footer strings. Keys like{' '}
            <code className="text-xs">nav.products</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={loadDefaults} className="btn-secondary">
            <Download className="w-4 h-4" />
            Load defaults
          </button>
          <button type="button" onClick={add} className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add string
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-[minmax(8rem,1fr)_1fr_1fr_auto] gap-3 px-4 py-3 bg-brand-paper text-[10px] font-semibold uppercase tracking-widest text-stone-500">
          <span>Key</span>
          <span>English</span>
          <span>Bengali</span>
          <span />
        </div>
        {rows.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            <Languages className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No overrides yet. Load defaults, then edit and save.</p>
            <button type="button" onClick={loadDefaults} className="btn-primary mt-4">
              Load defaults
            </button>
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(8rem,1fr)_1fr_1fr_auto] gap-3 px-4 py-3 border-t border-stone-100"
            >
              <input
                value={row.key}
                onChange={(e) => update(row.id, 'key', e.target.value)}
                placeholder="nav.products"
                className="input-field font-mono text-xs h-9"
              />
              <input
                value={row.valueEn}
                onChange={(e) => update(row.id, 'valueEn', e.target.value)}
                placeholder="English"
                className="input-field text-sm h-9"
              />
              <input
                value={row.valueBn}
                onChange={(e) => update(row.id, 'valueBn', e.target.value)}
                placeholder="বাংলা"
                className="input-field text-sm h-9"
              />
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="text-stone-300 hover:text-red-600 p-2 cursor-pointer"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
