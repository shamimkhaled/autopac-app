interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart; fine for single-instance deployments)
const store = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  store.forEach((record, key) => {
    if (now > record.resetTime) store.delete(key);
  });
}, 60_000);

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

/**
 * Check if a request from `identifier` (e.g. IP address) is within the allowed rate.
 * @param identifier  Unique key per client (IP or user id)
 * @param maxRequests Max requests allowed within the window
 * @param windowMs    Time window in milliseconds (default: 60s)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
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
 * Extract the client IP from a Next.js Request object.
 * Falls back to a generic identifier if no IP is available.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
