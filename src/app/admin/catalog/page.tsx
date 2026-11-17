'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Loader2, Save, Check } from 'lucide-react';
import { BROCHURE_LINES, BROCHURE_PAGE_COUNT, type ProductBrochureMap } from '@/data/brochure';

interface ProductRow {
  slug: string;
  nameEn: string;
}

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [map, setMap] = useState<ProductBrochureMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    Promise.all([fetch('/api/products').then((r) => r.json()), fetch('/api/catalog-map').then((r) => r.json())])
      .then(([prods, catalog]) => {
        setProducts(Array.isArray(prods) ? prods.map((p: ProductRow) => ({ slug: p.slug, nameEn: p.nameEn })) : []);
        setMap(catalog && typeof catalog === 'object' ? catalog : {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setMeta = (slug: string, field: 'lineId' | 'page', value: string) => {
    setMap((current) => {
      const prev = current[slug] || { lineId: BROCHURE_LINES[0].id, page: 1 };
      if (field === 'lineId') {
        const line = BROCHURE_LINES.find((l) => l.id === value);
        return { ...current, [slug]: { lineId: value, page: line?.startPage || prev.page } };
      }
      return { ...current, [slug]: { ...prev, page: Math.min(BROCHURE_PAGE_COUNT, Math.max(1, Number(value) || 1)) } };
    });
  };

  const clearMeta = (slug: string) => {
    setMap((current) => {
      const next = { ...current };
      delete next[slug];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/catalog-map', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(map),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Catalog links saved. Machine pages now deep-link to matching brochure sheets.' });
      } else {
        setStatus({ type: 'err', text: 'Could not save catalog map.' });
      }
    } catch {
      setStatus({ type: 'err', text: 'Network error while saving catalog map.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading catalog map…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Official catalog map
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Tie each CMS machine to a numbered product line and a page in the 122-page brochure.
          </p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="btn-primary whitespace-nowrap">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save map'}
        </button>
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

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500 border-b border-stone-200">
              <th className="px-4 py-3">Machine</th>
              <th className="px-4 py-3">Product line</th>
              <th className="px-4 py-3">Catalog page</th>
              <th className="px-4 py-3">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => {
              const meta = map[p.slug];
              return (
                <tr key={p.slug} className="hover:bg-brand-paper/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-stone-900">{p.nameEn}</p>
                    <p className="text-xs text-stone-400 font-mono">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={meta?.lineId || ''}
                      onChange={(e) => {
                        if (!e.target.value) clearMeta(p.slug);
                        else setMeta(p.slug, 'lineId', e.target.value);
                      }}
                      className="input-field h-9 min-w-[12rem] text-xs cursor-pointer"
                    >
                      <option value="">Not in catalog</option>
                      {BROCHURE_LINES.map((line) => (
                        <option key={line.id} value={line.id}>
                          {line.number} {line.shortEn}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      max={BROCHURE_PAGE_COUNT}
                      disabled={!meta}
                      value={meta?.page || ''}
                      onChange={(e) => setMeta(p.slug, 'page', e.target.value)}
                      className="input-field h-9 w-24 text-xs tabular-nums disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {meta ? (
                      <Link
                        href={`/brochure?line=${meta.lineId}&page=${meta.page}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-brand-maroon font-medium text-xs hover:underline tabular-nums"
                      >
                        <BookOpen className="w-4 h-4" />
                        Page {meta.page}
                      </Link>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
