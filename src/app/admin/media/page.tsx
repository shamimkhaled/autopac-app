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
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      const res = await fetch(`/api/upload/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaItems(mediaItems.filter((item) => item.id !== id));
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark">Media Library</h1>
          <p className="text-gray-500">Images used on machinery cards, hero slides, and catalog pages</p>
        </div>
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="flex items-center gap-2 px-6 py-3 bg-action-orange text-white font-bold rounded-2xl shadow-lg shadow-action-orange/20 hover:bg-orange-600 transition-all"
        >
          <Upload className="w-5 h-5" />
          Upload New
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          {([
            ['all', 'All Assets'],
            ['image', 'Images'],
            ['video', 'Videos'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setKind(id)}
              className={`px-5 py-2.5 font-bold rounded-xl whitespace-nowrap transition-colors ${
                kind === id ? 'bg-industrial-dark text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-400 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-transparent border-none text-sm font-bold text-industrial-dark outline-none cursor-pointer"
            >
              <option value="new">Newest First</option>
              <option value="old">Oldest First</option>
              <option value="size">Largest Size</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Scanning assets...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 opacity-30" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-industrial-dark opacity-50">Your library is empty</p>
              <p className="mt-1">Upload images to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {visible.map((item) => (
              <div key={item.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.alt || 'Media'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.url, item.id)}
                      className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/40 transition-colors text-white"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedia(item.id)}
                      className="p-3 bg-red-500/80 backdrop-blur-md rounded-xl hover:bg-red-600 transition-colors text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-industrial-dark truncate mb-1">{item.alt || item.url.split('/').pop()}</p>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {(item.size / 1024).toFixed(0)} KB • {item.width}x{item.height}
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
