'use client';

import { Suspense } from 'react';
import BrochureViewer from '@/components/BrochureViewer';
import { Loader2 } from 'lucide-react';

export default function BrochurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f4f1ea]">
          <Loader2 className="w-10 h-10 text-[#8B2E2E] animate-spin" aria-label="Loading catalog" />
        </div>
      }
    >
      <BrochureViewer />
    </Suspense>
  );
}
