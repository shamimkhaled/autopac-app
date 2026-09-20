import { NextResponse } from 'next/server';
import { getWebsiteContent } from '@/lib/siteContent';

export async function GET() {
  try {
    const content = await getWebsiteContent();
    return NextResponse.json(content);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
