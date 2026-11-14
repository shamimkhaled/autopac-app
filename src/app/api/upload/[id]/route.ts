import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, ADMIN_WRITE_ROLES } from '@/lib/requireAdmin';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin(ADMIN_WRITE_ROLES);
    if (!auth.ok) return auth.response;

    const { id } = params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const publicRoot = path.resolve(process.cwd(), 'public');
    const uploadsRoot = path.resolve(publicRoot, 'uploads');
    const relative = media.url.replace(/^\/+/, '');
    const filePath = path.resolve(publicRoot, relative);

    // Contain deletes to public/uploads — reject poisoned DB URLs
    if (!filePath.startsWith(uploadsRoot + path.sep) && filePath !== uploadsRoot) {
      return NextResponse.json({ error: 'Invalid media path' }, { status: 400 });
    }

    try {
      await unlink(filePath);
    } catch (e) {
      console.error('File unlink error:', e);
    }

    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete Media Error:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
