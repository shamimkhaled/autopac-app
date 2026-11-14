import { NextResponse } from 'next/server';
import { getWebsiteContent, saveWebsiteContent, type WebsiteContent } from '@/lib/siteContent';
import { revalidatePublicSite } from '@/lib/cmsApi';
import { requireAdmin } from '@/lib/requireAdmin';
import { websiteContentWriteSchema, zodErrorResponse } from '@/lib/cmsSchemas';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    return NextResponse.json(await getWebsiteContent());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const raw = await req.json();
    const parsed = websiteContentWriteSchema.safeParse(raw);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error) ?? NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await saveWebsiteContent(parsed.data as unknown as WebsiteContent);
    revalidatePublicSite();
    return NextResponse.json({ ok: true, content: await getWebsiteContent() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
