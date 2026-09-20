import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
