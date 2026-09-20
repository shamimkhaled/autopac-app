import { NextResponse } from 'next/server';
import { getWebsiteContent } from '@/lib/siteContent';
import { cmsJson } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const content = await getWebsiteContent();
    return cmsJson(content);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
