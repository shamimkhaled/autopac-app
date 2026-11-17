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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
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
    setStatus(null);
    try {
      const isNew = active.id.startsWith('new-');
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${active.slug}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(active),
      });
      if (res.ok) {
        setStatus({ type: 'ok', text: 'Article saved.' });
        setLoading(true);
        load();
      } else {
        setStatus({ type: 'err', text: 'Could not save article. Title (EN) is required.' });
      }
    } catch {
      setStatus({ type: 'err', text: 'Network error while saving article.' });
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!active) return;
    if (active.id.startsWith('new-')) {
      const remaining = posts.filter((p) => p.id !== active.id);
      setPosts(remaining);
      setActiveId(remaining[0]?.id || null);
      setConfirmDelete(false);
      return;
    }
    const res = await fetch(`/api/admin/blog/${active.slug}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(false);
      setStatus({ type: 'ok', text: 'Article deleted.' });
      setLoading(true);
      load();
    } else {
      setStatus({ type: 'err', text: 'Could not delete article.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading articles…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <div className="grid lg:grid-cols-[16rem_1fr] gap-6">
        <aside className="surface-card p-4 h-fit">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Articles</h2>
            <button
              type="button"
              onClick={() => {
                const next = empty();
                setPosts([next, ...posts]);
                setActiveId(next.id);
                setConfirmDelete(false);
              }}
              className="p-1.5 rounded-md bg-brand-maroon text-white hover:opacity-90"
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
                  onClick={() => {
                    setActiveId(p.id);
                    setConfirmDelete(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    p.id === activeId ? 'bg-brand-maroon text-white' : 'hover:bg-brand-paper text-stone-700'
                  }`}
                >
                  <span className="block font-medium truncate">{p.titleEn || 'Untitled'}</span>
                  <span className={`text-[11px] ${p.id === activeId ? 'text-white/75' : 'text-stone-400'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {active ? (
          <div className="surface-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <h1 className="font-display text-2xl font-semibold text-stone-900 tracking-tight">
                {active.id.startsWith('new-') ? 'New article' : 'Edit article'}
              </h1>
              <div className="flex items-center gap-2">
                {confirmDelete ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={remove}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md"
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="btn-secondary text-xs min-h-[36px] px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                    aria-label="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button type="button" onClick={save} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Title (English) *</label>
                <input
                  value={active.titleEn}
                  onChange={(e) => updateActive({ titleEn: e.target.value })}
                  placeholder="Headline in English"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Title (Bengali)</label>
                <input
                  value={active.titleBn}
                  onChange={(e) => updateActive({ titleBn: e.target.value })}
                  placeholder="শিরোনাম (বাংলা)"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Article body (English)</label>
              <textarea
                rows={6}
                value={active.contentEn}
                onChange={(e) => updateActive({ contentEn: e.target.value })}
                placeholder="Write announcement or dispatch..."
                className="input-field py-2.5"
              />
            </div>

            <div>
              <label className="field-label">Article body (Bengali)</label>
              <textarea
                rows={6}
                value={active.contentBn}
                onChange={(e) => updateActive({ contentBn: e.target.value })}
                placeholder="লেখা (বাংলা)..."
                className="input-field py-2.5"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-200">
              <button type="button" onClick={() => setPicker(true)} className="btn-secondary text-sm">
                <ImageIcon className="w-4 h-4" />
                {active.imageUrl ? 'Change cover image' : 'Pick cover image'}
              </button>
              {active.imageUrl && (
                <div className="relative w-24 h-16 rounded-md overflow-hidden border border-stone-200">
                  <Image src={active.imageUrl} alt="" fill className="object-cover" unoptimized />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700 ml-auto">
                <input
                  type="checkbox"
                  checked={active.published}
                  onChange={(e) => updateActive({ published: e.target.checked })}
                  className="w-4 h-4 accent-[#6D1A2D]"
                />
                Published on /news
              </label>
            </div>
          </div>
        ) : (
          <div className="surface-card border-dashed p-16 text-center text-sm text-stone-500">
            Create an Auto Pac dispatch to feature announcements at the top of the News page.
          </div>
        )}
      </div>

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
