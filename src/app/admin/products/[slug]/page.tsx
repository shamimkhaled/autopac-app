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
  X,
  Type,
  FileText
} from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductEdit({ params }: { params: { slug: string } }) {
  const isNew = params.slug === 'new';
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: string; nameEn: string }[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState<{ active: boolean; index: number | null }>({ active: false, index: null });
  
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
    slug: ''
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);

    if (!isNew) {
      fetch(`/api/products/${params.slug}`)
        .then(r => r.json())
        .then(d => {
          if (d && !d.error) {
            let images = [];
            let specs = [];
            let packableIds = [];
            
            try {
              images = Array.isArray(d.images) ? d.images : (typeof d.images === 'string' ? JSON.parse(d.images || '[]') : []);
            } catch (e) { console.error('Error parsing images', e); }
            
            try {
              specs = Array.isArray(d.specs) ? d.specs : (typeof d.specs === 'string' ? JSON.parse(d.specs || '[]') : []);
            } catch (e) { console.error('Error parsing specs', e); }
            
            try {
              packableIds = Array.isArray(d.packableIds) ? d.packableIds : (typeof d.packableIds === 'string' ? JSON.parse(d.packableIds || '[]') : []);
            } catch (e) { console.error('Error parsing packableIds', e); }

            setForm({
              ...d,
              images,
              specs,
              packableIds,
              videoUrl: d.videoUrl || '',
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
        alert('Failed to save product');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`/api/admin/products/${params.slug}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
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

  const addSpec = () => setForm({ ...form, specs: [...form.specs, { keyEn: '', keyBn: '', value: '', unit: '' }] });
  const updateSpec = (idx: number, field: string, val: string) => {
    const newSpecs = [...form.specs];
    newSpecs[idx] = { ...newSpecs[idx], [field]: val };
    setForm({ ...form, specs: newSpecs });
  };
  const removeSpec = (idx: number) => {
    setForm({ ...form, specs: form.specs.filter((_, i) => i !== idx) });
  };

  const addPackable = () => setForm({ ...form, packableIds: [...form.packableIds, ''] });
  const updatePackable = (idx: number, val: string) => {
    const newPackableIds = [...form.packableIds];
    newPackableIds[idx] = val;
    setForm({ ...form, packableIds: newPackableIds });
  };
  const removePackable = (idx: number) => {
    setForm({ ...form, packableIds: form.packableIds.filter((_, i) => i !== idx) });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest">Retrieving product data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products"
            className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-industrial-dark hover:border-gray-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">
              {isNew ? 'New Product' : 'Edit Product'}
            </h1>
            <p className="text-gray-500 font-medium">Configure machine details and specifications</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isNew && (
            <button 
              onClick={remove}
              className="px-6 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
            >
              Archive Machine
            </button>
          )}
          <button 
            onClick={save}
            disabled={saving}
            className="flex items-center gap-3 px-10 py-4 bg-industrial-dark text-white font-black rounded-3xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
            {saving ? 'Synchronizing...' : 'Save Product'}
          </button>
        </div>
      </div>

      <form onSubmit={save} className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-10">
            <h3 className="text-xl font-black text-industrial-dark flex items-center gap-4 border-b border-gray-100 pb-6">
              <Type className="w-6 h-6 text-action-orange" />
              Machine Identity
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Machine Name (EN) *</label>
                <input 
                  required 
                  value={form.nameEn} 
                  onChange={e => setForm({...form, nameEn: e.target.value})} 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all"
                  placeholder="e.g. Granule Packing Machine"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Machine Name (BN)</label>
                <input 
                  value={form.nameBn} 
                  onChange={e => setForm({...form, nameBn: e.target.value})} 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-lg focus:ring-4 focus:ring-action-orange/10 focus:border-action-orange outline-none transition-all"
                  placeholder="বাংলায় নাম..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category *</label>
                <select 
                  required 
                  value={form.categoryId} 
                  onChange={e => setForm({...form, categoryId: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-industrial-dark outline-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unique Slug (URL)</label>
                <input 
                  value={form.slug} 
                  onChange={e => setForm({...form, slug: e.target.value})} 
                  className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-mono text-xs text-gray-500 cursor-not-allowed" 
                  disabled={!isNew}
                  placeholder="auto-generated-from-name"
                />
              </div>
            </div>

            <div className="space-y-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
              <h4 className="text-sm font-black text-industrial-dark uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-action-orange" /> Machine Narrative
              </h4>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Description (Summary)</label>
                  <textarea 
                    value={form.shortDescEn} 
                    onChange={e => setForm({...form, shortDescEn: e.target.value})} 
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl font-medium min-h-[100px] outline-none"
                    placeholder="Brief overview for cards and lists..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Technical Description</label>
                  <textarea 
                    value={form.fullDescEn} 
                    onChange={e => setForm({...form, fullDescEn: e.target.value})} 
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl font-medium min-h-[250px] outline-none"
                    placeholder="Detailed features, benefits, and operation guide..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <h3 className="text-xl font-black text-industrial-dark flex items-center gap-4">
                <Settings className="w-6 h-6 text-action-orange" />
                Technical Specs
              </h3>
              <button 
                type="button" 
                onClick={addSpec}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-action-orange font-bold rounded-xl hover:bg-orange-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Row
              </button>
            </div>
            
            <div className="space-y-4">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group relative">
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <input 
                      value={spec.keyEn} 
                      onChange={e => updateSpec(i, 'keyEn', e.target.value)} 
                      placeholder="Property (e.g. Speed)"
                      className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold"
                    />
                    <input 
                      value={spec.keyBn} 
                      onChange={e => updateSpec(i, 'keyBn', e.target.value)} 
                      placeholder="Property (BN)"
                      className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold"
                    />
                    <input 
                      value={spec.value} 
                      onChange={e => updateSpec(i, 'value', e.target.value)} 
                      placeholder="Value (e.g. 50)"
                      className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                    />
                    <input 
                      value={spec.unit || ''} 
                      onChange={e => updateSpec(i, 'unit', e.target.value)} 
                      placeholder="Unit (e.g. bpm)"
                      className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeSpec(i)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {form.specs.length === 0 && (
                <p className="text-center py-10 text-gray-400 font-medium italic">No specifications defined for this machine.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-10">
          {/* Gallery */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-industrial-dark flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-action-orange" />
                Gallery
              </h3>
              <button 
                type="button" 
                onClick={addImage}
                className="text-xs font-black text-action-orange uppercase tracking-widest hover:underline"
              >
                + Add Slot
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {form.images.map((img, i) => (
                <div key={i} className="group relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
                  {img ? (
                    <>
                      <Image src={img} alt="Product" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => setShowMediaPicker({ active: true, index: i })}
                          className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-lg"
                        >
                          Change
                        </button>
                        <button 
                          type="button"
                          onClick={() => removeImage(i)}
                          className="px-4 py-1.5 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-black rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setShowMediaPicker({ active: true, index: i })}
                      className="flex flex-col items-center gap-2 text-gray-400 hover:text-action-orange transition-colors"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="font-bold text-[10px] uppercase">Pick Image</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Video & Links */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-industrial-dark flex items-center gap-3 border-b border-gray-100 pb-4">
              <Video className="w-5 h-5 text-action-orange" />
              Machine Demo
            </h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">YouTube Video Link</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  value={form.videoUrl} 
                  onChange={e => setForm({...form, videoUrl: e.target.value})} 
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-11 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-sm focus:ring-2 focus:ring-action-orange/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status & Options */}
          <div className="bg-industrial-dark p-8 rounded-3xl shadow-xl space-y-8">
            <h3 className="text-lg font-black text-white flex items-center gap-3 border-b border-white/10 pb-4">
              <List className="w-5 h-5 text-action-orange" />
              Visibility
            </h3>
            
            <label className="flex items-center gap-4 cursor-pointer p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${form.featured ? 'bg-action-orange border-action-orange' : 'border-white/20'}`}>
                {form.featured && <Check className="w-4 h-4 text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={form.featured} 
                onChange={e => setForm({...form, featured: e.target.checked})} 
              />
              <div>
                <p className="font-black text-white text-sm uppercase">Featured Machine</p>
                <p className="text-[10px] text-white/50 font-medium">Show in homepage highlight section</p>
              </div>
            </label>

            <div className="space-y-6 pt-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Package className="w-3 h-3" /> Packable Materials
              </h4>
              <div className="space-y-3">
                {form.packableIds.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      value={item} 
                      onChange={e => updatePackable(i, e.target.value)} 
                      placeholder="e.g. Sugar, Rice..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-medium outline-none focus:border-action-orange transition-colors"
                    />
                    <button type="button" onClick={() => removePackable(i)} className="text-white/30 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addPackable}
                  className="w-full py-2 bg-white/5 border border-white/10 border-dashed rounded-xl text-[10px] font-black text-white/50 uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  + Add Material
                </button>
              </div>
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
