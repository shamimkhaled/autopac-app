interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart; fine for single-instance deployments)
const store = new Map<string, RateLimitRecord>();

function pruneExpired(now: number) {
  store.forEach((record, key) => {
    if (now > record.resetTime) store.delete(key);
  });
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

/**
 * Check if a request from `identifier` (e.g. IP address) is within the allowed rate.
 * Safe for Edge middleware (lazy prune, no setInterval).
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  if (store.size > 5_000) pruneExpired(now);

  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return { allowed: true };
}

/**
 * Extract the client IP from a Next.js Request / NextRequest.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export function rateLimitResponse(retryAfter = 60): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'Cache-Control': 'no-store',
      },
    }
  );
}
