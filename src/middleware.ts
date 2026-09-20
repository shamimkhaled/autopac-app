import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function withAdminHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

const protectAdminPages = withAuth(
  function onSuccess() {
    return withAdminHeaders(NextResponse.next());
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = clientIp(req);
  const method = req.method.toUpperCase();

  const isLoginPage = pathname === '/admin/login';
  const isAuthApi = pathname.startsWith('/api/auth');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAdminUi = pathname.startsWith('/admin') && !isLoginPage;

  // Credential POSTs — hard cap to stop password spraying / bots
  const isLoginAttempt =
    method === 'POST' &&
    (pathname.includes('/api/auth/callback/credentials') ||
      pathname.includes('/api/auth/signin'));

  if (isLoginAttempt) {
    // 5 attempts / 15 minutes per IP
    const result = checkRateLimit(`admin-login:${ip}`, 5, 15 * 60_000);
    if (!result.allowed) {
      return rateLimitResponse(result.retryAfter ?? 900);
    }
  }

  if (isLoginPage || isAuthApi) {
    // Soft cap for CSRF / session polls (session is polled often — keep generous)
    const result = checkRateLimit(`admin-auth-soft:${ip}`, 180, 60_000);
    if (!result.allowed) {
      return rateLimitResponse(result.retryAfter ?? 60);
    }
    // Do not rewrite Cache-Control on next-auth JSON endpoints
    if (isAuthApi) return NextResponse.next();
    return withAdminHeaders(NextResponse.next());
  }

  if (isAdminApi) {
    // Session still checked in each route; this stops scrapers hammering APIs
    const result = checkRateLimit(`admin-api:${ip}`, 120, 60_000);
    if (!result.allowed) {
      return rateLimitResponse(result.retryAfter ?? 60);
    }
    return withAdminHeaders(NextResponse.next());
  }

  if (isAdminUi) {
    const result = checkRateLimit(`admin-ui:${ip}`, 180, 60_000);
    if (!result.allowed) {
      return rateLimitResponse(result.retryAfter ?? 60);
    }
    // next-auth withAuth middleware
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (protectAdminPages as unknown as (r: NextRequest) => Response | Promise<Response>)(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*', '/api/admin/:path*'],
};
