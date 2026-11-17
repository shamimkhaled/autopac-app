'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Media {
  id: string;
  url: string;
  alt?: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  selectedUrl?: string;
  allowMultiple?: boolean;
}

export default function MediaPicker({ onSelect, onClose, selectedUrl, allowMultiple = false }: MediaPickerProps) {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          await fetchMedia();
        }
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    multiple: allowMultiple,
  });

  const filteredMedia = mediaItems.filter(
    (item) =>
      item.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Media library picker"
    >
      <div className="bg-white w-full max-w-5xl h-[82vh] rounded-md border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-paper border border-stone-200 rounded-md flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-brand-maroon" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-stone-900">Media Library</h2>
              <p className="text-xs text-stone-500">Select or upload images for Auto Pac CMS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-md text-stone-500 hover:text-stone-800 transition-colors"
            aria-label="Close media picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-stone-200 bg-brand-paper/50 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="search"
              placeholder="Search images by filename..."
              className="input-field pl-9 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div
            {...getRootProps()}
            className={`flex-shrink-0 px-5 py-2 border border-dashed rounded-md cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium ${
              isDragActive
                ? 'border-brand-maroon bg-brand-maroon/5 text-brand-maroon'
                : 'border-stone-300 bg-white hover:border-brand-maroon text-stone-700'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload file'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
              <p className="text-sm text-stone-500">Loading media items…</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
              <ImageIcon className="w-12 h-12 opacity-40" />
              <p className="text-sm font-medium text-stone-600">No media items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredMedia.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  className={`group relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all bg-white text-left ${
                    selectedUrl === item.url
                      ? 'border-brand-maroon ring-2 ring-brand-maroon/20'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt || 'Media'}
                    fill
                    className="object-contain p-1.5"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                  />
                  {selectedUrl === item.url && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-brand-maroon rounded-md flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-stone-950/75 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[11px] text-white truncate">{item.alt || item.url.split('/').pop()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-stone-200 bg-white flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedUrl}
            onClick={() => selectedUrl && onSelect(selectedUrl)}
            className="btn-primary text-sm disabled:opacity-40"
          >
            Select Asset
          </button>
        </div>
      </div>
    </div>
  );
}
