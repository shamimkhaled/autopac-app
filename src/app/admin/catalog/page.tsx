'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Loader2, Save } from 'lucide-react';
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
    try {
      const res = await fetch('/api/admin/catalog-map', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(map),
      });
      if (res.ok) alert('Catalog links updated. Machine pages will jump to the matching brochure sheet.');
      else alert('Could not save catalog map.');
    } catch {
      alert('Could not save catalog map.');
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
          <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Official catalog map</h1>
          <p className="text-gray-500 font-medium">
            Tie each CMS machine to a numbered product line and a page in the 122-page brochure.
          </p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-action-orange text-white font-bold rounded-2xl">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save map
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3">Machine</th>
              <th className="px-4 py-3">Product line</th>
              <th className="px-4 py-3">Catalog page</th>
              <th className="px-4 py-3">Preview</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const meta = map[p.slug];
              return (
                <tr key={p.slug} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-industrial-dark">{p.nameEn}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={meta?.lineId || ''}
                      onChange={(e) => {
                        if (!e.target.value) clearMeta(p.slug);
                        else setMeta(p.slug, 'lineId', e.target.value);
                      }}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl min-w-[12rem]"
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
                      className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {meta ? (
                      <Link
                        href={`/brochure?line=${meta.lineId}&page=${meta.page}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-action-orange font-bold"
                      >
                        <BookOpen className="w-4 h-4" />
                        Page {meta.page}
                      </Link>
                    ) : (
                      <span className="text-gray-300">—</span>
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
