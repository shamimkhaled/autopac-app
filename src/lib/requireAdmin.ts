import { getServerSession, type Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/** Any CMS portal role (matches Prisma Role enum). */
export const CMS_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;

/** Mutations that should stay admin-only (media, quote status, product delete). */
export const ADMIN_WRITE_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;

type AuthOk = { ok: true; session: Session };
type AuthFail = { ok: false; response: NextResponse };

/**
 * Shared gate for admin/CMS API routes.
 * Returns `{ ok: true, session }` or `{ ok: false, response }` (401).
 */
export async function requireAdmin(
  roles: readonly string[] = CMS_ROLES
): Promise<AuthOk | AuthFail> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user || !role || !roles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
