import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, ADMIN_WRITE_ROLES } from '@/lib/requireAdmin';
import { quoteStatusSchema, zodErrorResponse } from '@/lib/cmsSchemas';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin(ADMIN_WRITE_ROLES);
    if (!auth.ok) return auth.response;

    const { id } = params;
    const body = await req.json();
    const parsed = quoteStatusSchema.safeParse(body);
    if (!parsed.success) {
      return zodErrorResponse(parsed.error) ?? NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const quote = await prisma.quotationRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(quote);
  } catch (e) {
    console.error('Update Quote Error:', e);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin(ADMIN_WRITE_ROLES);
    if (!auth.ok) return auth.response;

    const { id } = params;
    await prisma.quotationRequest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete Quote Error:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
