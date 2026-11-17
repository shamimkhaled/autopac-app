'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import MediaPicker from '@/components/Admin/MediaPicker';

interface Media {
  id: string;
  url: string;
  alt?: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export default function MediaManagerPage() {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [picker, setPicker] = useState(false);
  const [kind, setKind] = useState<'all' | 'image' | 'video'>('all');
  const [sort, setSort] = useState<'new' | 'old' | 'size'>('new');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      setMediaItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/upload/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        setConfirmDeleteId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const visible = mediaItems
    .filter((item) => (kind === 'all' ? true : item.type === kind))
    .sort((a, b) => {
      if (sort === 'size') return (b.size || 0) - (a.size || 0);
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === 'old' ? da - db : db - da;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Media library
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Uploaded machinery photos, hero banners, and partner logos
          </p>
        </div>
        <button type="button" onClick={() => setPicker(true)} className="btn-primary whitespace-nowrap">
          <Upload className="w-4 h-4" />
          Upload new asset
        </button>
      </div>

      <div className="surface-card p-5 space-y-5">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
          {([
            ['all', 'All assets'],
            ['image', 'Images'],
            ['video', 'Videos'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setKind(id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md border whitespace-nowrap transition-colors ${
                kind === id
                  ? 'bg-brand-maroon text-white border-brand-maroon'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-stone-400">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="input-field h-9 text-xs cursor-pointer"
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="size">Largest size</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
            <p className="text-sm text-stone-500">Scanning media assets…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-400 border border-dashed border-stone-200 rounded-md">
            <ImageIcon className="w-10 h-10 opacity-40" />
            <p className="text-sm font-medium text-stone-600">No media assets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {visible.map((item) => (
              <div key={item.id} className="group bg-white border border-stone-200 rounded-md overflow-hidden">
                <div className="aspect-square relative overflow-hidden bg-brand-paper/40 border-b border-stone-200">
                  <Image
                    src={item.url}
                    alt={item.alt || 'Media'}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.url, item.id)}
                      className="p-1.5 bg-white/95 border border-stone-200 rounded-md text-stone-700 hover:text-brand-maroon shadow-sm"
                      title="Copy asset URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {confirmDeleteId === item.id ? (
                      <button
                        type="button"
                        onClick={() => deleteMedia(item.id)}
                        className="px-2 py-1 bg-red-600 text-white text-[11px] font-semibold rounded-md shadow-sm"
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 bg-white/95 border border-stone-200 rounded-md text-stone-500 hover:text-red-600 shadow-sm"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-stone-900 truncate mb-0.5">
                    {item.alt || item.url.split('/').pop()}
                  </p>
                  <span className="text-[11px] text-stone-400 tabular-nums">
                    {(item.size / 1024).toFixed(0)} KB
                    {item.width && item.height ? ` · ${item.width}×${item.height}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {picker && (
        <MediaPicker
          onSelect={() => {
            setPicker(false);
            fetchMedia();
          }}
          onClose={() => {
            setPicker(false);
            fetchMedia();
          }}
        />
      )}
    </div>
  );
}
