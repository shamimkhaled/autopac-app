---
title: "Review fixes: brochure deep-link, product fallback, requireAdmin"
author: Shamimkhaled
date: 2026-11-10
branch: main
touches:
  - ".env.example"
  - prisma/seed.ts
  - src/app/api/admin/analytics/route.ts
  - src/app/api/admin/appearance/route.ts
  - "src/app/api/admin/blog/[slug]/route.ts"
  - src/app/api/admin/blog/route.ts
  - src/app/api/admin/catalog-map/route.ts
  - src/app/api/admin/categories/route.ts
  - src/app/api/admin/company/route.ts
  - src/app/api/admin/hero/route.ts
---

## Decided
- BrochureViewer must prefer explicit `?page=` over `line.startPage` (machine→catalog deep-links use both).
- Product detail uses static `src/data/products.ts` via `getStaticProductBySlug` / `isProductPayload`; API `[slug]` also falls back on DB miss/error.
- Shared `requireAdmin(CMS_ROLES | ADMIN_WRITE_ROLES)` for all CMS/upload/quote admin APIs; GET `/api/upload` is authenticated.
- Zod schemas live in `src/lib/cmsSchemas.ts` for products, categories, catalog-map, website content, quote status; quote emails use `escapeHtml`.
- Seed refuses weak/missing `ADMIN_PASSWORD` (min 10). Login lookup uses lowercased email.
- Middleware matcher includes `/api/upload` and `/api/quote` (POST quote still public; only non-POST quote counted as admin API for rate headers).

## Tried and ruled out
- Redis-backed rate limits — single-process cPanel `server.js` is the deploy; documented in-memory limitation instead.
- Full SSR rewrite of product detail — kept client page with static fallback for smaller blast radius.

## Watch out
- Quote statuses must stay `PENDING|REVIEWED|RESPONDED|CLOSED` (Prisma `QuoteStatus` + admin UI).
- EDITOR can read/write most CMS; upload/quote mutate/product delete stay ADMIN|SUPER_ADMIN.
- Do not insert `requireAdmin` import into the middle of multi-line import blocks.
