'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Globe, Check, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl?: string;
  sortOrder: number;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState<{ active: boolean; partnerId: string | null }>({ active: false, partnerId: null });

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json())
      .then((data) => {
        const sortedData = Array.isArray(data) ? data : [];
        setPartners(sortedData.map((p: any, i: number) => ({ ...p, sortOrder: p.sortOrder ?? i })));
      })
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Partner, value: string | number) => {
    setPartners((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const addPartner = () => {
    setPartners([...partners, { 
      id: `new-${Date.now()}`, 
      name: '', 
      logoUrl: '', 
      linkUrl: '', 
      sortOrder: partners.length 
    }]);
  };

  const removePartner = (id: string) => {
    if (!confirm('Remove this partner?')) return;
    setPartners(partners.filter(p => p.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partners),
      });
      if (res.ok) alert('Partners list updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to save partners.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
        <p className="text-gray-500 font-medium uppercase tracking-widest">Loading partners...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark uppercase tracking-tight">Trusted Partners</h1>
          <p className="text-gray-500 font-medium">Manage logos for client and partner display</p>
        </div>
        <button 
          onClick={addPartner} 
          className="flex items-center gap-2 px-6 py-3 bg-industrial-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {partners.map((p, i) => (
          <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6 group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 bg-gray-50 text-gray-400 font-black rounded-lg flex items-center justify-center text-xs">0{i + 1}</span>
              <button 
                onClick={() => removePartner(p.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Delete Partner"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[3/2] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
              {p.logoUrl ? (
                <>
                  <Image src={p.logoUrl} alt={p.name} fill className="object-contain p-6" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setShowMediaPicker({ active: true, partnerId: p.id })}
                      className="px-6 py-2 bg-white/20 backdrop-blur-md text-white font-bold rounded-xl"
                    >
                      Update Logo
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => setShowMediaPicker({ active: true, partnerId: p.id })}
                  className="flex flex-col items-center gap-2 text-gray-400 hover:text-action-orange transition-colors"
                >
                  <ImageIcon className="w-10 h-10" />
                  <span className="font-bold text-xs uppercase tracking-widest">Select Logo</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Partner Name</label>
                <input 
                  value={p.name} 
                  onChange={(e) => update(p.id, 'name', e.target.value)} 
                  placeholder="Company Name..."
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-industrial-dark focus:ring-2 focus:ring-action-orange/20 outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> Website Link (Optional)
                </label>
                <input 
                  value={p.linkUrl || ''} 
                  onChange={(e) => update(p.id, 'linkUrl', e.target.value)} 
                  placeholder="https://..."
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-sm text-gray-600 focus:ring-2 focus:ring-action-orange/20 outline-none" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 opacity-20" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold opacity-50 uppercase tracking-tight">No partners listed</p>
            <p className="mt-1 font-medium">Add your first corporate client or partner</p>
          </div>
          <button onClick={addPartner} className="px-8 py-3 bg-industrial-dark text-white font-bold rounded-2xl">Create Partner Entry</button>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button 
          onClick={save} 
          disabled={saving || partners.length === 0} 
          className="flex items-center gap-3 px-10 py-4 bg-action-orange text-white font-black rounded-3xl shadow-xl shadow-action-orange/30 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {saving ? 'Synchronizing...' : 'Save Partner Directory'}
        </button>
      </div>

      {showMediaPicker.active && (
        <MediaPicker 
          onSelect={(url) => {
            if (showMediaPicker.partnerId) {
              update(showMediaPicker.partnerId, 'logoUrl', url);
            }
            setShowMediaPicker({ active: false, partnerId: null });
          }}
          onClose={() => setShowMediaPicker({ active: false, partnerId: null })}
          selectedUrl={partners.find(p => p.id === showMediaPicker.partnerId)?.logoUrl}
        />
      )}
    </div>
  );
}
