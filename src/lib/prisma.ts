import { PrismaClient } from '@prisma/client';

type MockMethod = (...args: unknown[]) => Promise<unknown>;

function createModelMock(): Record<string, MockMethod> {
  return {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (args?: unknown) => {
      const a = args as { data?: Record<string, unknown> } | undefined;
      return a?.data ?? {};
    },
    createMany: async () => ({ count: 0 }),
    update: async (args?: unknown) => {
      const a = args as { data?: Record<string, unknown> } | undefined;
      return a?.data ?? {};
    },
    updateMany: async () => ({ count: 0 }),
    upsert: async (args?: unknown) => {
      const a = args as { create?: Record<string, unknown>; update?: Record<string, unknown> } | undefined;
      return a?.create ?? a?.update ?? {};
    },
    delete: async () => ({}),
    deleteMany: async () => ({ count: 0 }),
    count: async () => 0,
    groupBy: async () => [],
    aggregate: async () => ({}),
  };
}

function isDbConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; code?: string; message?: string };
  const msg = e.message || '';
  return (
    e.name === 'PrismaClientInitializationError' ||
    e.code === 'P1001' ||
    e.code === 'P1002' ||
    e.code === 'P1003' ||
    msg.includes("Can't reach database server") ||
    msg.includes('Environment variable not found: DATABASE_URL') ||
    msg.includes('ECONNREFUSED')
  );
}

function createPrismaWithFallback(): PrismaClient {
  let dbOffline = !process.env.DATABASE_URL;
  let realClient: PrismaClient | null = null;

  if (!dbOffline) {
    try {
      realClient = new PrismaClient({ log: ['error'] });
    } catch {
      dbOffline = true;
    }
  } else {
    console.warn('[AI Studio] DATABASE_URL not set — using in-memory mock');
  }

  const mockModelCache = new Map<string | symbol, Record<string, MockMethod>>();
  const wrappedModelCache = new Map<string | symbol, Record<string, MockMethod>>();

  const getMockModel = (prop: string | symbol) => {
    let m = mockModelCache.get(prop);
    if (!m) {
      m = createModelMock();
      mockModelCache.set(prop, m);
    }
    return m;
  };

  const proxy: unknown = new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === '$connect' || prop === '$disconnect') {
          return async () => {
            if (dbOffline || !realClient) return;
            try {
              await (realClient[prop] as () => Promise<void>)();
            } catch (err) {
              if (isDbConnectionError(err)) {
                dbOffline = true;
                console.warn('[AI Studio] Database unreachable — switching to mock');
                return;
              }
              throw err;
            }
          };
        }

        if (prop === '$transaction') {
          return async (arg: unknown) => {
            if (dbOffline || !realClient) {
              if (typeof arg === 'function') {
                return (arg as (tx: unknown) => Promise<unknown>)(proxy);
              }
              return Array.isArray(arg) ? Promise.all(arg) : [];
            }
            try {
              return await realClient.$transaction(arg as never);
            } catch (err) {
              if (isDbConnectionError(err)) {
                dbOffline = true;
                console.warn('[AI Studio] Database unreachable — switching to mock');
                if (typeof arg === 'function') {
                  return (arg as (tx: unknown) => Promise<unknown>)(proxy);
                }
                return Array.isArray(arg) ? Promise.all(arg) : [];
              }
              throw err;
            }
          };
        }

        if (prop === 'then') return undefined;

        if (!wrappedModelCache.has(prop)) {
          const mockModel = getMockModel(prop);
          const wrappedModel = new Proxy(mockModel, {
            get(target, method) {
              const fallbackFn = target[method as string] ?? (async () => null);
              return async (...args: unknown[]) => {
                if (dbOffline || !realClient) {
                  return fallbackFn(...args);
                }
                const realModel = (realClient as unknown as Record<string | symbol, Record<string | symbol, MockMethod>>)[prop];
                const realFn = realModel?.[method];
                if (typeof realFn !== 'function') {
                  return fallbackFn(...args);
                }
                try {
                  return await realFn.apply(realModel, args);
                } catch (err) {
                  if (isDbConnectionError(err)) {
                    dbOffline = true;
                    console.warn('[AI Studio] Database unreachable — switching to mock');
                    return fallbackFn(...args);
                  }
                  throw err;
                }
              };
            },
          });
          wrappedModelCache.set(prop, wrappedModel);
        }

        return wrappedModelCache.get(prop);
      },
    }
  );

  return proxy as PrismaClient;
}

declare global {
  var prisma: undefined | PrismaClient;
}

const prisma: PrismaClient = globalThis.prisma ?? createPrismaWithFallback();

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
