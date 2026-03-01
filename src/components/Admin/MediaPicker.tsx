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

  const filteredMedia = mediaItems.filter(item => 
    item.alt?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-action-orange" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-industrial-dark">Media Library</h2>
              <p className="text-sm text-gray-500">Select or upload images for your content</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search & Upload */}
        <div className="p-6 border-b bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-action-orange/20 focus:border-action-orange transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div 
            {...getRootProps()} 
            className={`flex-shrink-0 px-6 py-2.5 border-2 border-dashed rounded-xl cursor-pointer transition-all flex items-center gap-2 font-medium ${
              isDragActive ? 'border-action-orange bg-orange-50 text-action-orange' : 'border-gray-200 hover:border-action-orange hover:bg-orange-50 text-gray-600'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {uploading ? 'Uploading...' : 'Upload New'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-10 h-10 text-action-orange animate-spin" />
              <p className="text-gray-500 animate-pulse">Loading media items...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ImageIcon className="w-16 h-16 opacity-20" />
              <p className="text-lg">No media items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${
                    selectedUrl === item.url ? 'border-action-orange shadow-lg' : 'border-transparent hover:border-orange-200 shadow-sm'
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt || 'Media'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
                  />
                  {selectedUrl === item.url && (
                    <div className="absolute top-2 right-2 w-7 h-7 bg-action-orange rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate font-medium">{item.alt || item.url.split('/').pop()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white flex justify-end gap-3 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!selectedUrl}
            onClick={() => selectedUrl && onSelect(selectedUrl)}
            className="px-8 py-2.5 bg-action-orange text-white font-bold rounded-xl shadow-lg shadow-action-orange/20 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
          >
            Select Asset
          </button>
        </div>
      </div>
    </div>
  );
}
