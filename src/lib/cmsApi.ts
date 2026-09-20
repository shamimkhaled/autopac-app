import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/** CMS GET responses must never be statically cached by Next or the browser. */
export function cmsJson(data: unknown, init?: { status?: number }) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
    },
  });
}

/** After an admin save, bust public page data so the live site updates. */
export function revalidatePublicSite() {
  const paths = [
    '/',
    '/about',
    '/contact',
    '/products',
    '/gallery',
    '/brochure',
    '/news',
    '/admin',
  ];
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      /* ignore when called outside request context */
    }
  }
}
