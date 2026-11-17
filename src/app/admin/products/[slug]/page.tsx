'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Trash2,
  Plus,
  Image as ImageIcon,
  Video,
  List,
  Settings,
  Check,
  ArrowLeft,
  Loader2,
  Type,
  FileText,
} from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import Image from 'next/image';
import Link from 'next/link';
import { packableItems } from '@/data/products';
import { BROCHURE_LINES, BROCHURE_PAGE_COUNT } from '@/data/brochure';
import { toYoutubeEmbedUrl } from '@/data/videos';

export default function AdminProductEdit({ params }: { params: { slug: string } }) {
  const isNew = params.slug === 'new';
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: string; nameEn: string }[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState<{ active: boolean; index: number | null }>({
    active: false,
    index: null,
  });

  const [form, setForm] = useState({
    categoryId: '',
    nameEn: '',
    nameBn: '',
    shortDescEn: '',
    shortDescBn: '',
    fullDescEn: '',
    fullDescBn: '',
    images: [] as string[],
    specs: [] as { keyEn: string; keyBn: string; value: string; unit?: string }[],
    packableIds: [] as string[],
    videoUrl: '',
    featured: false,
    slug: '',
    brochureLineId: '',
    brochurePage: 1,
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);

    if (!isNew) {
      Promise.all([
        fetch(`/api/products/${params.slug}`).then((r) => r.json()),
        fetch('/api/catalog-map').then((r) => r.json()).catch(() => ({})),
      ])
        .then(([d, catalog]) => {
          if (d && !d.error) {
            let images: string[] = [];
            let specs: { keyEn: string; keyBn: string; value: string; unit?: string }[] = [];
            let packableIds: string[] = [];

            try {
              images = Array.isArray(d.images)
                ? d.images
                : typeof d.images === 'string'
                ? JSON.parse(d.images || '[]')
                : [];
            } catch {
              images = [];
            }

            try {
              specs = Array.isArray(d.specs)
                ? d.specs
                : typeof d.specs === 'string'
                ? JSON.parse(d.specs || '[]')
                : [];
            } catch {
              specs = [];
            }

            try {
              packableIds = Array.isArray(d.packableIds)
                ? d.packableIds
                : typeof d.packableIds === 'string'
                ? JSON.parse(d.packableIds || '[]')
                : [];
            } catch {
              packableIds = [];
            }

            const catalogMeta = catalog?.[d.slug];
            setForm({
              ...d,
              images,
              specs,
              packableIds,
              videoUrl: d.videoUrl || '',
              brochureLineId: catalogMeta?.lineId || '',
              brochurePage: catalogMeta?.page || 1,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isNew, params.slug]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const url = isNew ? '/api/admin/products' : `/api/admin/products/${params.slug}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error || 'Failed to save product. Check required fields.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Network error while saving.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.slug}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setErrorMsg('Could not delete this machine.');
      }
    } catch {
      setErrorMsg('Network error deleting machine.');
    }
  };

  const addImage = () => setForm({ ...form, images: [...form.images, ''] });
  const updateImage = (idx: number, val: string) => {
    const newImages = [...form.images];
    newImages[idx] = val;
    setForm({ ...form, images: newImages });
  };
  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const addSpec = () =>
    setForm({ ...form, specs: [...form.specs, { keyEn: '', keyBn: '', value: '', unit: '' }] });
  const updateSpec = (idx: number, field: string, val: string) => {
    const newSpecs = [...form.specs];
    newSpecs[idx] = { ...newSpecs[idx], [field]: val };
    setForm({ ...form, specs: newSpecs });
  };
  const removeSpec = (idx: number) => {
    setForm({ ...form, specs: form.specs.filter((_, i) => i !== idx) });
  };

  const youtubePreview = toYoutubeEmbedUrl(form.videoUrl);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading machine details…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-10 h-10 bg-white border border-stone-200 rounded-md flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-brand-maroon transition-colors"
            aria-label="Back to machinery"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              {isNew ? 'Add machinery' : form.nameEn || 'Edit machinery'}
            </h2>
            <p className="text-sm text-stone-500">Configure machine copy, specs, images, and YouTube demo</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isNew &&
            (confirmDelete ? (
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={remove}
                  className="px-3.5 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="btn-ghost text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ))}

          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save machine'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3.5 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={save} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="surface-card p-5 sm:p-6 space-y-6">
            <h3 className="font-display text-lg font-semibold text-stone-900 flex items-center gap-2.5 border-b border-stone-200 pb-3">
              <Type className="w-4 h-4 text-brand-maroon" />
              Machine Identity
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Machine Name (EN) *</label>
                <input
                  required
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="input-field font-medium"
                  placeholder="e.g. Granule Packing Machine"
                />
              </div>
              <div>
                <label className="field-label">Machine Name (BN)</label>
                <input
                  value={form.nameBn}
                  onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                  className="input-field"
                  placeholder="বাংলায় নাম..."
                />
              </div>
              <div>
                <label className="field-label">Category *</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="input-field font-mono text-xs disabled:bg-stone-100 disabled:text-stone-500"
                  disabled={!isNew}
                  placeholder="auto-generated-from-name"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-maroon" /> Machine Narrative
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Short Summary (EN)</label>
                  <textarea
                    rows={3}
                    value={form.shortDescEn}
                    onChange={(e) => setForm({ ...form, shortDescEn: e.target.value })}
                    className="input-field py-2.5"
                    placeholder="Brief overview for product cards..."
                  />
                </div>
                <div>
                  <label className="field-label">Short Summary (BN)</label>
                  <textarea
                    rows={3}
                    value={form.shortDescBn}
                    onChange={(e) => setForm({ ...form, shortDescBn: e.target.value })}
                    className="input-field py-2.5"
                    placeholder="কার্ডে দেখানো সংক্ষিপ্ত বর্ণনা..."
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Full Description (EN)</label>
                  <textarea
                    rows={6}
                    value={form.fullDescEn}
                    onChange={(e) => setForm({ ...form, fullDescEn: e.target.value })}
                    className="input-field py-2.5"
                    placeholder="Detailed features, operation guide, capacity..."
                  />
                </div>
                <div>
                  <label className="field-label">Full Description (BN)</label>
                  <textarea
                    rows={6}
                    value={form.fullDescBn}
                    onChange={(e) => setForm({ ...form, fullDescBn: e.target.value })}
                    className="input-field py-2.5"
                    placeholder="পূর্ণ বিবরণ বাংলায়..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="surface-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-display text-lg font-semibold text-stone-900 flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-brand-maroon" />
                Technical Specifications
              </h3>
              <button
                type="button"
                onClick={addSpec}
                className="btn-secondary text-xs min-h-[36px] px-3 py-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add row
              </button>
            </div>

            <div className="space-y-2.5">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-brand-paper/50 rounded-md border border-stone-200">
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      value={spec.keyEn}
                      onChange={(e) => updateSpec(i, 'keyEn', e.target.value)}
                      placeholder="Property (EN)"
                      className="input-field h-9 text-xs"
                    />
                    <input
                      value={spec.keyBn}
                      onChange={(e) => updateSpec(i, 'keyBn', e.target.value)}
                      placeholder="Property (BN)"
                      className="input-field h-9 text-xs"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => updateSpec(i, 'value', e.target.value)}
                      placeholder="Value (e.g. 50)"
                      className="input-field h-9 text-xs tabular-nums"
                    />
                    <input
                      value={spec.unit || ''}
                      onChange={(e) => updateSpec(i, 'unit', e.target.value)}
                      placeholder="Unit (e.g. bpm)"
                      className="input-field h-9 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-md"
                    aria-label="Remove spec row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {form.specs.length === 0 && (
                <p className="text-center py-6 text-sm text-stone-400">No technical rows added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Gallery */}
          <div className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-display text-base font-semibold text-stone-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-maroon" />
                Machine Photos
              </h3>
              <button
                type="button"
                onClick={addImage}
                className="text-xs font-semibold text-brand-maroon hover:underline"
              >
                + Add slot
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square bg-white rounded-md border border-stone-200 flex items-center justify-center overflow-hidden"
                >
                  {img ? (
                    <>
                      <Image src={img} alt="Product" fill sizes="120px" unoptimized className="object-contain p-1.5" />
                      <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowMediaPicker({ active: true, index: i })}
                          className="px-3 py-1 bg-white text-stone-900 text-xs font-semibold rounded-md"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker({ active: true, index: i })}
                      className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-brand-maroon transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs font-medium">Pick image</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Video Demo */}
          <div className="surface-card p-5 space-y-3">
            <h3 className="font-display text-base font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Video className="w-4 h-4 text-brand-maroon" />
              YouTube Video Demo
            </h3>
            <div>
              <label className="field-label">YouTube URL</label>
              <input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="input-field text-sm"
              />
            </div>
            {youtubePreview && (
              <div className="relative aspect-video rounded-md overflow-hidden bg-stone-950 border border-stone-200">
                <iframe
                  src={youtubePreview}
                  title="YouTube video preview"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Visibility, Packables & Catalog Map */}
          <div className="surface-card p-5 space-y-5">
            <h3 className="font-display text-base font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <List className="w-4 h-4 text-brand-maroon" />
              Visibility & Brochure Map
            </h3>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-md border border-stone-200 bg-brand-paper/50 hover:border-brand-maroon transition-colors">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[#6D1A2D]"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">Featured Machine</p>
                <p className="text-xs text-stone-500">Show inside homepage highlight grid</p>
              </div>
            </label>

            <div className="space-y-2">
              <p className="field-label flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Packable materials
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {packableItems.map((item) => {
                  const on = form.packableIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          packableIds: on
                            ? form.packableIds.filter((id) => id !== item.id)
                            : [...form.packableIds, item.id],
                        })
                      }
                      className={`text-left px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        on
                          ? 'bg-brand-maroon border-brand-maroon text-white'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {item.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-stone-200">
              <label className="field-label">Official catalog mapping</label>
              <select
                value={form.brochureLineId}
                onChange={(e) => {
                  const line = BROCHURE_LINES.find((l) => l.id === e.target.value);
                  setForm({
                    ...form,
                    brochureLineId: e.target.value,
                    brochurePage: line?.startPage || form.brochurePage,
                  });
                }}
                className="input-field text-sm cursor-pointer"
              >
                <option value="">Not mapped to brochure</option>
                {BROCHURE_LINES.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.number} {line.shortEn}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={BROCHURE_PAGE_COUNT}
                disabled={!form.brochureLineId}
                value={form.brochurePage}
                onChange={(e) => setForm({ ...form, brochurePage: Number(e.target.value) })}
                className="input-field text-sm tabular-nums disabled:opacity-40"
                placeholder="Catalog page"
              />
            </div>
          </div>
        </div>
      </form>

      {showMediaPicker.active && (
        <MediaPicker
          onSelect={(url) => {
            if (showMediaPicker.index !== null) {
              updateImage(showMediaPicker.index, url);
            }
            setShowMediaPicker({ active: false, index: null });
          }}
          onClose={() => setShowMediaPicker({ active: false, index: null })}
          selectedUrl={showMediaPicker.index !== null ? form.images[showMediaPicker.index] : undefined}
        />
      )}
    </div>
  );
}
