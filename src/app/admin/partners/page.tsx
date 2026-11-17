'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Globe, Image as ImageIcon, Loader2, Save, Check } from 'lucide-react';
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
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState<{ active: boolean; partnerId: string | null }>({
    active: false,
    partnerId: null,
  });

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json())
      .then((data) => {
        const sortedData = Array.isArray(data) ? data : [];
        setPartners(sortedData.map((p: Partner, i: number) => ({ ...p, sortOrder: p.sortOrder ?? i })));
      })
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Partner, value: string | number) => {
    setPartners((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const addPartner = () => {
    setPartners([
      ...partners,
      {
        id: `new-${Date.now()}`,
        name: '',
        logoUrl: '',
        linkUrl: '',
        sortOrder: partners.length,
      },
    ]);
  };

  const removePartner = (id: string) => {
    setPartners(partners.filter((p) => p.id !== id));
    setStatus({ type: 'ok', text: 'Partner removed from draft. Click Save partners to apply.' });
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partners),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Partner directory updated.' });
      } else {
        setStatus({ type: 'err', text: 'Failed to save partners.' });
      }
    } catch (e) {
      console.error(e);
      setStatus({ type: 'err', text: 'Network error saving partners.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading partners…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Trusted partners
          </h2>
          <p className="text-sm text-stone-500 mt-1">Manage corporate client logos displayed across the site</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addPartner} className="btn-secondary">
            <Plus className="w-4 h-4" />
            Add partner
          </button>
          <button type="button" onClick={save} disabled={saving || partners.length === 0} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save partners'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {partners.map((p, i) => (
          <div key={p.id} className="surface-card p-5 space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 tabular-nums">
                Partner #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removePartner(p.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                title="Delete Partner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[3/2] bg-white rounded-md border border-dashed border-stone-300 flex items-center justify-center overflow-hidden">
              {p.logoUrl ? (
                <>
                  <Image src={p.logoUrl} alt={p.name} fill sizes="200px" unoptimized className="object-contain p-4" />
                  <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker({ active: true, partnerId: p.id })}
                      className="px-3.5 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-md"
                    >
                      Update logo
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMediaPicker({ active: true, partnerId: p.id })}
                  className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-brand-maroon transition-colors"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs font-medium">Select logo</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="field-label">Partner Name</label>
                <input
                  value={p.name}
                  onChange={(e) => update(p.id, 'name', e.target.value)}
                  placeholder="Company Name..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Website URL (Optional)
                </label>
                <input
                  value={p.linkUrl || ''}
                  onChange={(e) => update(p.id, 'linkUrl', e.target.value)}
                  placeholder="https://..."
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 surface-card border-dashed">
          <ImageIcon className="w-10 h-10 text-stone-300" />
          <p className="text-sm font-medium text-stone-600">No partners listed yet.</p>
          <button type="button" onClick={addPartner} className="btn-secondary text-xs">
            Create partner entry
          </button>
        </div>
      )}

      {showMediaPicker.active && (
        <MediaPicker
          onSelect={(url) => {
            if (showMediaPicker.partnerId) {
              update(showMediaPicker.partnerId, 'logoUrl', url);
            }
            setShowMediaPicker({ active: false, partnerId: null });
          }}
          onClose={() => setShowMediaPicker({ active: false, partnerId: null })}
          selectedUrl={partners.find((p) => p.id === showMediaPicker.partnerId)?.logoUrl}
        />
      )}
    </div>
  );
}
