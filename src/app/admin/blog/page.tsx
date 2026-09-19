'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Save, Check, Image as ImageIcon } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import Image from 'next/image';

interface Post {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  imageUrl?: string | null;
  published: boolean;
}

const empty = (): Post => ({
  id: `new-${Date.now()}`,
  slug: '',
  titleEn: '',
  titleBn: '',
  contentEn: '',
  contentBn: '',
  imageUrl: '',
  published: true,
});

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState(false);

  const active = posts.find((p) => p.id === activeId) || null;

  const load = () => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPosts(list);
        setActiveId((id) => id || list[0]?.id || null);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateActive = (patch: Partial<Post>) => {
    if (!active) return;
    setPosts((list) => list.map((p) => (p.id === active.id ? { ...p, ...patch } : p)));
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const isNew = active.id.startsWith('new-');
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${active.slug}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(active),
      });
      if (res.ok) {
        setLoading(true);
        load();
      } else alert('Could not save article.');
    } catch {
      alert('Could not save article.');
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!active || !confirm('Delete this article?')) return;
    if (active.id.startsWith('new-')) {
      setPosts(posts.filter((p) => p.id !== active.id));
      setActiveId(posts.find((p) => p.id !== active.id)?.id || null);
      return;
    }
    const res = await fetch(`/api/admin/blog/${active.slug}`, { method: 'DELETE' });
    if (res.ok) {
      setLoading(true);
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[16rem_1fr] gap-6">
      <aside className="bg-white rounded-3xl border border-gray-100 p-4 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Articles</h2>
          <button
            type="button"
            onClick={() => {
              const next = empty();
              setPosts([next, ...posts]);
              setActiveId(next.id);
            }}
            className="p-2 rounded-xl bg-industrial-dark text-white"
            aria-label="New article"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-1">
          {posts.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                  p.id === activeId ? 'bg-action-orange text-white' : 'hover:bg-gray-50'
                }`}
              >
                <span className="block font-bold truncate">{p.titleEn || 'Untitled'}</span>
                <span className={`text-[10px] uppercase ${p.id === activeId ? 'text-white/70' : 'text-gray-400'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {active ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-black text-industrial-dark uppercase tracking-tight">
              {active.id.startsWith('new-') ? 'New article' : 'Edit article'}
            </h1>
            <div className="flex gap-2">
              <button type="button" onClick={remove} className="px-4 py-2 text-red-500 font-bold rounded-xl hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
              <button type="button" onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-action-orange text-white font-bold rounded-2xl">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={active.titleEn}
              onChange={(e) => updateActive({ titleEn: e.target.value })}
              placeholder="Title (EN)"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold"
            />
            <input
              value={active.titleBn}
              onChange={(e) => updateActive({ titleBn: e.target.value })}
              placeholder="শিরোনাম (বাংলা)"
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold"
            />
          </div>
          <textarea
            value={active.contentEn}
            onChange={(e) => updateActive({ contentEn: e.target.value })}
            placeholder="Article body (EN)"
            className="w-full min-h-[160px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl"
          />
          <textarea
            value={active.contentBn}
            onChange={(e) => updateActive({ contentBn: e.target.value })}
            placeholder="লেখা (বাংলা)"
            className="w-full min-h-[160px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl"
          />

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => setPicker(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-bold">
              <ImageIcon className="w-4 h-4" />
              {active.imageUrl ? 'Change image' : 'Pick image'}
            </button>
            {active.imageUrl && (
              <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200">
                <Image src={active.imageUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
              <span className={`w-5 h-5 rounded border flex items-center justify-center ${active.published ? 'bg-action-orange border-action-orange' : 'border-gray-300'}`}>
                {active.published && <Check className="w-3 h-3 text-white" />}
              </span>
              <input
                type="checkbox"
                className="hidden"
                checked={active.published}
                onChange={(e) => updateActive({ published: e.target.checked })}
              />
              Published on /news
            </label>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center text-gray-400">
          Create an Auto Pac update. It appears at the top of the News page.
        </div>
      )}

      {picker && (
        <MediaPicker
          onSelect={(url) => {
            updateActive({ imageUrl: url });
            setPicker(false);
          }}
          onClose={() => setPicker(false)}
          selectedUrl={active?.imageUrl || undefined}
        />
      )}
    </div>
  );
}
