'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Check, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import Image from 'next/image';

interface Slide {
  id: string;
  titleEn: string;
  titleBn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState<{ active: boolean; slideId: string | null }>({
    active: false,
    slideId: null,
  });

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((r) => r.json())
      .then((data) => setSlides(Array.isArray(data) ? data : []))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Slide, value: string | number | boolean) => {
    setSlides((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: `new-${Date.now()}`,
        titleEn: '',
        titleBn: '',
        imageUrl: '',
        sortOrder: slides.length,
        isActive: true,
      },
    ]);
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter((s) => s.id !== id));
    setStatus({ type: 'ok', text: 'Slide removed from draft. Click Save slides to commit.' });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Hero slides updated successfully.' });
      } else {
        setStatus({ type: 'err', text: 'Failed to save slides.' });
      }
    } catch (e) {
      console.error(e);
      setStatus({ type: 'err', text: 'Network error saving slides.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading hero slides…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Hero slider
          </h2>
          <p className="text-sm text-stone-500 mt-1">Manage homepage showcase slides and captions</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addSlide} className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add slide
          </button>
          <button type="button" onClick={save} disabled={saving || slides.length === 0} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save slides'}
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
        {slides.map((s, i) => (
          <div key={s.id} className="surface-card overflow-hidden group">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-80 aspect-video lg:aspect-auto bg-brand-paper/50 relative border-b lg:border-b-0 lg:border-r border-stone-200 min-h-[180px]">
                {s.imageUrl ? (
                  <>
                    <Image
                      src={s.imageUrl}
                      alt={s.titleEn || 'Hero Slide'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker({ active: true, slideId: s.id })}
                        className="px-4 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-md"
                      >
                        Change image
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker({ active: true, slideId: s.id })}
                    className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 hover:text-brand-maroon transition-colors"
                  >
                    <ImageIcon className="w-9 h-9 mb-1.5" />
                    <span className="text-xs font-medium">Pick slide image</span>
                  </button>
                )}
              </div>

              <div className="flex-1 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 tabular-nums">
                    Slide #{i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                      <input
                        type="checkbox"
                        checked={s.isActive}
                        onChange={(e) => update(s.id, 'isActive', e.target.checked)}
                        className="w-4 h-4 accent-[#6D1A2D]"
                      />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSlide(s.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Title (English)</label>
                    <input
                      value={s.titleEn}
                      onChange={(e) => update(s.id, 'titleEn', e.target.value)}
                      placeholder="Headline in English..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Title (Bengali)</label>
                    <input
                      value={s.titleBn}
                      onChange={(e) => update(s.id, 'titleBn', e.target.value)}
                      placeholder="বাংলায় শিরোনাম লিখুন..."
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label">Image path</label>
                    <input
                      value={s.imageUrl}
                      readOnly
                      placeholder="Pick from media library..."
                      className="input-field font-mono text-xs bg-stone-50 text-stone-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 surface-card border-dashed">
          <ImageIcon className="w-10 h-10 text-stone-300" />
          <p className="text-sm font-medium text-stone-600">No hero slides configured yet.</p>
          <button type="button" onClick={addSlide} className="btn-secondary text-xs">
            Create first slide
          </button>
        </div>
      )}

      {showMediaPicker.active && (
        <MediaPicker
          onSelect={(url) => {
            if (showMediaPicker.slideId) {
              update(showMediaPicker.slideId, 'imageUrl', url);
            }
            setShowMediaPicker({ active: false, slideId: null });
          }}
          onClose={() => setShowMediaPicker({ active: false, slideId: null })}
          selectedUrl={slides.find((s) => s.id === showMediaPicker.slideId)?.imageUrl}
        />
      )}
    </div>
  );
}
