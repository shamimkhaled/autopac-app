'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface Category {
  id: string;
  nameEn: string;
}

interface Product {
  id: string;
  slug: string;
  modelCode?: string;
  nameEn: string;
  nameBn: string;
  categoryId: string;
  category?: { nameEn: string };
  images: string | string[];
  featured: boolean;
  createdAt: string;
}

const PAGE_SIZE = 15;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([pData, cData]) => {
        setProducts(Array.isArray(pData) ? pData : []);
        setCategories(Array.isArray(cData) ? cData : []);
      })
      .catch((e) => {
        console.error(e);
        setNotice({ type: 'err', text: 'Failed to load machinery inventory.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
        setConfirmDeleteSlug(null);
        setNotice({ type: 'ok', text: 'Machine deleted from inventory.' });
      } else {
        setNotice({ type: 'err', text: 'Could not delete machine.' });
      }
    } catch (e) {
      console.error(e);
      setNotice({ type: 'err', text: 'Network error deleting machine.' });
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
      if (featuredOnly && !p.featured) return false;
      if (!q) return true;
      return (
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.modelCode?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [products, categoryFilter, featuredOnly, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Machinery inventory
          </h2>
          <p className="text-sm text-stone-500 mt-1 tabular-nums">
            {products.length} machines registered across {categories.length} categories
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Add machine
        </Link>
      </div>

      {notice && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-md border text-sm ${
            notice.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="p-1" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="surface-card p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="search"
              placeholder="Search machine name, model code, or slug..."
              className="input-field pl-9 h-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="input-field h-10 cursor-pointer"
          >
            <option value="all">All categories ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameEn}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setFeaturedOnly((v) => !v);
              setPage(1);
            }}
            aria-pressed={featuredOnly}
            className={`px-3.5 h-10 rounded-md text-xs font-medium border whitespace-nowrap transition-colors ${
              featuredOnly
                ? 'bg-brand-maroon text-white border-brand-maroon'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            Featured only
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
            <p className="text-sm text-stone-500">Loading machinery catalog…</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-stone-200 rounded-md">
            <Package className="w-8 h-8 text-stone-300" />
            <p className="text-sm font-medium text-stone-600">No machines match your current filter.</p>
            <Link href="/admin/products/new" className="btn-secondary text-xs min-h-[38px]">
              Add new machine
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    <th className="py-3 pr-4">Machine</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Homepage</th>
                    <th className="py-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pageItems.map((p) => {
                    let images: string[] = [];
                    try {
                      images = Array.isArray(p.images)
                        ? p.images
                        : typeof p.images === 'string'
                        ? JSON.parse(p.images || '[]')
                        : [];
                    } catch {
                      images = [];
                    }
                    const firstImage = images[0] || '';

                    return (
                      <tr key={p.id} className="hover:bg-brand-paper/40 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-md overflow-hidden relative border border-stone-200 shrink-0">
                              {firstImage ? (
                                <Image src={firstImage} alt={p.nameEn} fill sizes="48px" unoptimized className="object-contain p-1" />
                              ) : (
                                <Package className="w-5 h-5 text-stone-300 absolute inset-0 m-auto" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/products/${p.slug}`}
                                className="font-semibold text-stone-900 hover:text-brand-maroon block truncate max-w-sm"
                              >
                                {p.nameEn}
                              </Link>
                              <p className="text-xs text-stone-400 font-mono truncate">
                                {p.modelCode ? `${p.modelCode} · ` : ''}{p.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs font-medium text-stone-600">
                          {p.category?.nameEn || 'General'}
                        </td>
                        <td className="py-3 px-3">
                          {p.featured ? (
                            <span className="text-xs font-semibold text-brand-maroon">Featured</span>
                          ) : (
                            <span className="text-xs text-stone-400">Standard</span>
                          )}
                        </td>
                        <td className="py-3 pl-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="p-2 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-100"
                              title="View live page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/products/${p.slug}`}
                              className="p-2 text-stone-500 hover:text-brand-maroon rounded-md hover:bg-stone-100"
                              title="Edit specifications"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            {confirmDeleteSlug === p.slug ? (
                              <div className="inline-flex items-center gap-1 ml-1">
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(p.slug)}
                                  className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded-md"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteSlug(null)}
                                  className="px-2 py-1 text-xs text-stone-600 border border-stone-200 rounded-md"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteSlug(p.slug)}
                                className="p-2 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs text-stone-500">
                <span className="tabular-nums">
                  Showing {pageItems.length} of {filteredProducts.length} · Page {safePage}/{totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn-secondary text-xs min-h-[36px] px-3 py-1 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="btn-secondary text-xs min-h-[36px] px-3 py-1 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
