'use client';

import { PenSquare } from 'lucide-react';

export default function AdminBlogPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-action-orange/10 flex items-center justify-center mb-6">
        <PenSquare className="w-10 h-10 text-action-orange" />
      </div>
      <h2 className="text-2xl font-black text-industrial-dark uppercase tracking-tight mb-3">
        Blog Management
      </h2>
      <p className="text-gray-500 text-sm font-medium max-w-sm">
        Blog & article management is coming soon. Posts will appear here once the module is ready.
      </p>
    </div>
  );
}
