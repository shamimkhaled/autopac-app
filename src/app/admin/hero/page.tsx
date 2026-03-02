'use client';

import { useEffect, useState } from 'react';
import { Upload, Plus, Trash2, GripVertical, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
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
  const [showMediaPicker, setShowMediaPicker] = useState<{ active: boolean; slideId: string | null }>({ active: false, slideId: null });

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
    setSlides([...slides, { 
      id: `new-${Date.now()}`, 
      titleEn: '', titleBn: '', imageUrl: '', 
      sortOrder: slides.length, isActive: true 
    }]);
  };

  const removeSlide = (id: string) => {
    if (!confirm('Remove this slide?')) return;
    setSlides(slides.filter(s => s.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides),
      });
      if (res.ok) alert('Hero slides updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save slides.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
        <p className="text-gray-500 font-medium">Loading hero slides...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark">Hero Slider</h1>
          <p className="text-gray-500">Manage the large slides on your homepage</p>
        </div>
        <button 
          onClick={addSlide} 
          className="flex items-center gap-2 px-6 py-3 bg-industrial-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Slide
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((s, i) => (
          <div key={s.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="flex flex-col lg:flex-row">
              {/* Preview & Image Picker */}
              <div className="w-full lg:w-96 aspect-video lg:aspect-auto bg-gray-50 relative border-b lg:border-b-0 lg:border-r border-gray-100">
                {s.imageUrl ? (
                  <>
                    <Image
                      src={s.imageUrl}
                      alt={s.titleEn || 'Hero Slide'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 384px"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setShowMediaPicker({ active: true, slideId: s.id })}
                        className="px-6 py-2.5 bg-white/20 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/40 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowMediaPicker({ active: true, slideId: s.id })}
                    className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-action-orange transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="font-bold text-sm">Pick Image</span>
                  </button>
                )}
              </div>

              {/* Form Content */}
              <div className="flex-1 p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-gray-100 text-gray-500 font-black rounded-lg flex items-center justify-center text-xs">0{i + 1}</span>
                    <h3 className="text-lg font-bold text-industrial-dark">Slide Configuration</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-white transition-colors">
                      <input 
                        type="checkbox" 
                        checked={s.isActive} 
                        onChange={(e) => update(s.id, 'isActive', e.target.checked)} 
                        className="w-4 h-4 text-action-orange focus:ring-action-orange rounded border-gray-300"
                      />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{s.isActive ? 'Active' : 'Draft'}</span>
                    </label>
                    <button 
                      onClick={() => removeSlide(s.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title (English)</label>
                    <input 
                      value={s.titleEn} 
                      onChange={(e) => update(s.id, 'titleEn', e.target.value)} 
                      placeholder="Enter powerful headline..."
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-action-orange/20 focus:border-action-orange transition-all outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title (Bengali)</label>
                    <input 
                      value={s.titleBn} 
                      onChange={(e) => update(s.id, 'titleBn', e.target.value)} 
                      placeholder="বাংলায় শিরোনাম লিখুন..."
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-action-orange/20 focus:border-action-orange transition-all outline-none font-medium"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Image URL (Selected automatically)</label>
                    <input 
                      value={s.imageUrl} 
                      readOnly
                      placeholder="Choose an image from the library..."
                      className="w-full px-5 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-400 font-mono text-xs cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <ImageIcon className="w-16 h-16 opacity-20" />
          <p className="text-xl font-bold opacity-50">No hero slides found</p>
          <button onClick={addSlide} className="px-8 py-3 bg-industrial-dark text-white font-bold rounded-2xl">Create First Slide</button>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button 
          onClick={save} 
          disabled={saving || slides.length === 0} 
          className="flex items-center gap-3 px-10 py-4 bg-action-orange text-white font-black rounded-3xl shadow-xl shadow-action-orange/30 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          {saving ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Updating Database...
            </>
          ) : (
            <>
              <Check className="w-6 h-6" />
              Save Slider Settings
            </>
          )}
        </button>
      </div>

      {showMediaPicker.active && (
        <MediaPicker 
          onSelect={(url) => {
            if (showMediaPicker.slideId) {
              update(showMediaPicker.slideId, 'imageUrl', url);
            }
            setShowMediaPicker({ active: false, slideId: null });
          }}
          onClose={() => setShowMediaPicker({ active: false, slideId: null })}
          selectedUrl={slides.find(s => s.id === showMediaPicker.slideId)?.imageUrl}
        />
      )}
    </div>
  );
}
