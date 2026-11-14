import { NextResponse } from 'next/server';
import { processAndSaveImage } from '@/lib/media';
import { requireAdmin, ADMIN_WRITE_ROLES } from '@/lib/requireAdmin';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin(ADMIN_WRITE_ROLES);
    if (!auth.ok) return auth.response;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const alt = formData.get('alt') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const media = await processAndSaveImage(file, alt || undefined);

    return NextResponse.json(media);
  } catch (e) {
    console.error('Upload Error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(media);
  } catch (e) {
    console.error('Fetch Media Error:', e);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
