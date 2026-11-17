'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Check, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import MediaPicker from '@/components/Admin/MediaPicker';

interface Owner {
  id: string;
  nameEn: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  photoUrl?: string;
  bioEn?: string;
  bioBn?: string;
  messageEn?: string;
  messageBn?: string;
}

export default function AdminOwnerPage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    fetch('/api/owner')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setOwner(d);
        } else {
          setOwner({
            id: '',
            nameEn: '',
            nameBn: '',
            titleEn: '',
            titleBn: '',
            photoUrl: '',
            bioEn: '',
            bioBn: '',
            messageEn: '',
            messageBn: '',
          });
        }
      })
      .catch(() =>
        setOwner({
          id: '',
          nameEn: '',
          nameBn: '',
          titleEn: '',
          titleBn: '',
          photoUrl: '',
          bioEn: '',
          bioBn: '',
          messageEn: '',
          messageBn: '',
        })
      );
  }, []);

  const update = (field: keyof Owner, value: string) => {
    setOwner((o) => (o ? { ...o, [field]: value } : null));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/owner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(owner),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Owner profile saved.' });
      } else {
        setStatus({ type: 'err', text: 'Failed to save owner profile.' });
      }
    } catch {
      setStatus({ type: 'err', text: 'Network error saving owner profile.' });
    }
    setSaving(false);
  };

  if (!owner) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading owner profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Owner & leadership profile
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Shown inside the Leadership section on the About Auto Pac page
          </p>
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

      <form onSubmit={save} className="surface-card p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Name (English)</label>
            <input
              value={owner.nameEn}
              onChange={(e) => update('nameEn', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">Name (Bengali)</label>
            <input
              value={owner.nameBn}
              onChange={(e) => update('nameBn', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">Title (English)</label>
            <input
              value={owner.titleEn}
              onChange={(e) => update('titleEn', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">Title (Bengali)</label>
            <input
              value={owner.titleBn}
              onChange={(e) => update('titleBn', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="field-label">Leadership Portrait</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {owner.photoUrl && (
              <div className="relative w-20 h-24 rounded-md overflow-hidden border border-stone-200 shrink-0">
                <Image src={owner.photoUrl} alt={owner.nameEn || 'Owner'} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex-1 w-full flex gap-2">
              <input
                value={owner.photoUrl || ''}
                onChange={(e) => update('photoUrl', e.target.value)}
                placeholder="https://... or /images/..."
                className="input-field flex-1"
              />
              <button type="button" onClick={() => setShowMediaPicker(true)} className="btn-secondary shrink-0">
                <ImageIcon className="w-4 h-4" />
                Pick photo
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Bio (English)</label>
            <textarea
              value={owner.bioEn || ''}
              onChange={(e) => update('bioEn', e.target.value)}
              rows={3}
              className="input-field py-2.5"
            />
          </div>
          <div>
            <label className="field-label">Bio (Bengali)</label>
            <textarea
              value={owner.bioBn || ''}
              onChange={(e) => update('bioBn', e.target.value)}
              rows={3}
              className="input-field py-2.5"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Leadership Message (English)</label>
            <textarea
              value={owner.messageEn || ''}
              onChange={(e) => update('messageEn', e.target.value)}
              rows={4}
              className="input-field py-2.5"
            />
          </div>
          <div>
            <label className="field-label">Leadership Message (Bengali)</label>
            <textarea
              value={owner.messageBn || ''}
              onChange={(e) => update('messageBn', e.target.value)}
              rows={4}
              className="input-field py-2.5"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => {
            update('photoUrl', url);
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
          selectedUrl={owner.photoUrl}
        />
      )}
    </div>
  );
}
