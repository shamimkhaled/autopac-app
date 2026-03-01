import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete files (original and responsive variants)
    // We can assume variants are named based on original file if we stored it properly
    // For simplicity, let's just delete the main URL file for now
    const filePath = path.join(process.cwd(), 'public', media.url);
    try {
      await unlink(filePath);
      
      // Also attempt to delete variants if we can find them
      // In a real app, we might store variant URLs in the DB
      // For now, let's just clean up the DB entry
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
