'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch('/api/owner').then((r) => r.json()).then((d) => setOwner(d || {
      id: '', nameEn: '', nameBn: '', titleEn: '', titleBn: '', photoUrl: '', bioEn: '', bioBn: '', messageEn: '', messageBn: '',
    }));
  }, []);

  const update = (field: keyof Owner, value: string) => {
    setOwner((o) => (o ? { ...o, [field]: value } : null));
  };

  const save = async () => {
    if (!owner) return;
    setSaving(true);
    await fetch('/api/admin/owner', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(owner),
    });
    setSaving(false);
  };

  if (!owner) return <div className="text-industrial-silver">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-dark mb-6">Owner Profile</h1>
      <form onSubmit={(e) => { e.preventDefault(); save(); }} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Name (EN)</label>
            <input value={owner.nameEn} onChange={(e) => update('nameEn', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Name (BN)</label>
            <input value={owner.nameBn} onChange={(e) => update('nameBn', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Title (EN)</label>
            <input value={owner.titleEn} onChange={(e) => update('titleEn', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm mb-1">Title (BN)</label>
            <input value={owner.titleBn} onChange={(e) => update('titleBn', e.target.value)} className="w-full px-4 py-2 border rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Photo URL</label>
          <input value={owner.photoUrl || ''} onChange={(e) => update('photoUrl', e.target.value)} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio (EN)</label>
          <textarea value={owner.bioEn || ''} onChange={(e) => update('bioEn', e.target.value)} rows={3} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio (BN)</label>
          <textarea value={owner.bioBn || ''} onChange={(e) => update('bioBn', e.target.value)} rows={3} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Leadership Message (EN)</label>
          <textarea value={owner.messageEn || ''} onChange={(e) => update('messageEn', e.target.value)} rows={4} className="w-full px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Leadership Message (BN)</label>
          <textarea value={owner.messageBn || ''} onChange={(e) => update('messageBn', e.target.value)} rows={4} className="w-full px-4 py-2 border rounded" />
        </div>
        <button type="submit" disabled={saving} className="px-6 py-2 bg-action-orange text-white rounded-lg font-medium">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
