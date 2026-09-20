# Auto Pac — Production deployment

This site is **Next.js 14** + **Prisma/MySQL** + **next-auth** admin CMS.  
Primary domain: `https://autopacbd.com`

| Host | Best for | Notes |
|------|----------|--------|
| **ExonHost cPanel** | Production (recommended) | Persistent disk for `/uploads`, local MySQL, custom `server.js` |
| **Vercel** | Preview / marketing edge | Needs **external MySQL**; local file uploads do **not** persist |

---

## Shared: environment variables

Copy from `.env.example`. Set these in the host UI (never commit `.env`).

```env
# MySQL (cPanel DB or remote host)
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"

# Auth — generate with: openssl rand -base64 32
NEXTAUTH_SECRET="paste-strong-secret-here"
NEXTAUTH_URL="https://autopacbd.com"
NEXT_PUBLIC_SITE_URL="https://autopacbd.com"

# Admin (used by npm run db:seed)
ADMIN_EMAIL="admin@autopacbd.com"
ADMIN_PASSWORD="your-strong-password"

# Optional email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
SMTP_FROM="support@autopacbd.com"
ADMIN_EMAIL="autopacbd@gmail.com"

# Optional analytics (or set in Admin → SEO)
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_FB_PIXEL_ID=""
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=""
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
```

**Admin login after seed:** `/admin/login`  
Email / password = `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

---

## A) ExonHost cPanel (Node.js App)

### 1. MySQL in cPanel

1. **MySQL® Databases** → create database + user → grant **ALL**.
2. Note connection values, e.g.  
   `mysql://autopacb_user:PASS@localhost:3306/autopacb_backend_db`  
   (On some hosts the host is `localhost` or `127.0.0.1`, not a public IP.)
3. If you ever connect from your laptop: **Remote MySQL** → allow your IP.

### 2. Upload the app

**Option A — Git (preferred)**  
cPanel → **Git Version Control** → clone this repo into e.g. `~/autopac-app`.

**Option B — ZIP**  
Upload project zip (exclude `node_modules`, `.next`) → extract under `~/autopac-app`.

Keep brochure assets: `public/brochures/`, `brochure-content/` if used.

### 3. Create Node.js application

cPanel → **Setup Node.js App** (or “Application Manager”):

| Field | Value |
|--------|--------|
| Node.js version | **18.x or 20.x** (LTS) |
| Application mode | **Production** |
| Application root | `autopac-app` (folder with `package.json`) |
| Application URL | `autopacbd.com` (or subdomain) |
| Application startup file | **`server.js`** |
| Passenger log | enable if available |

Click **Create**.

### 4. Environment variables (in Node.js App UI)

Add every variable from the Shared section above.  
Important:

- `NEXTAUTH_URL` = `https://autopacbd.com` (no trailing slash)
- `NEXT_PUBLIC_SITE_URL` = same
- `DATABASE_URL` = cPanel MySQL string
- `HOSTNAME` = `0.0.0.0` (if the app must bind all interfaces; some hosts set `PORT` for you)

Do **not** leave `NEXTAUTH_URL` as `http://localhost:3000` in production.

### 5. Install, schema, build (SSH or “Run NPM Install”)

In the app directory (SSH):

```bash
cd ~/autopac-app   # or your application root

# Use the same Node the Node.js App selected (cPanel often provides):
# source ~/nodevenv/autopac-app/18/bin/activate   # path varies by host

npm install
npx prisma generate
npx prisma db push
npm run db:seed     # creates/updates admin user from ADMIN_* env
npm run build
```

Or in the Node.js App UI: **Run NPM Install**, then open Terminal / SSH for Prisma + build.

### 6. Start / restart

In **Setup Node.js App** → **Restart**.  
Startup command is effectively: `NODE_ENV=production node server.js` (`npm start`).

Confirm:

- `https://autopacbd.com` loads  
- `https://autopacbd.com/admin/login` works  
- Upload a logo in Admin → Company — file should appear under `public/uploads/`

### 7. SSL & domain

1. Point DNS A record to ExonHost.  
2. cPanel → **SSL/TLS Status** → AutoSSL / Let’s Encrypt.  
3. Force HTTPS redirect if offered.

### 8. Redeploy (updates)

```bash
cd ~/autopac-app
git pull          # or upload new files
npm install
npx prisma generate
npx prisma db push   # only if schema changed
npm run build
```

Then **Restart** the Node.js App.

### 9. cPanel checklist

- [ ] Node 18+  
- [ ] Startup file = `server.js`  
- [ ] Production env vars (especially `NEXTAUTH_*` + `DATABASE_URL`)  
- [ ] `npm run build` succeeded (`.next` folder exists)  
- [ ] `prisma db push` + seed  
- [ ] `public/uploads` writable by the Node user  
- [ ] SSL on domain  

---

## B) Vercel

Vercel runs Next as **serverless**. This project’s `server.js` is **ignored** on Vercel (that is OK).

### Limitations (read before choosing Vercel as only host)

1. **MySQL** must be reachable from the internet (ExonHost Remote MySQL, PlanetScale, Railway, Aiven, etc.). `localhost` MySQL will not work.  
2. **Admin media uploads** write to disk (`public/uploads`). On Vercel that filesystem is **ephemeral** — uploads disappear on redeploy. Prefer ExonHost for full CMS, or later wire S3/R2.  
3. Brochure PDFs/images in `public/brochures` must be in the Git repo (or CDN).

### 1. External MySQL

Example using ExonHost MySQL from Vercel:

1. cPanel → **Remote MySQL** → allow Vercel / `%.%.%.%` (or ask host support).  
2. `DATABASE_URL="mysql://USER:PASS@YOUR_CPANEL_HOST:3306/DB"`

### 2. Import project

1. Push repo to GitHub/GitLab.  
2. [vercel.com](https://vercel.com) → **Add New Project** → import repo.  
3. Framework: **Next.js** (auto).  
4. Build settings:

| Setting | Value |
|---------|--------|
| Build Command | `prisma generate && next build` (or `npm run build`) |
| Output | default (Next) |
| Install | `npm install` |
| Node | 18.x or 20.x |

### 3. Environment variables (Vercel → Settings → Environment Variables)

Same as Shared section. Set for **Production** (and Preview if you want):

- `DATABASE_URL`  
- `NEXTAUTH_SECRET`  
- `NEXTAUTH_URL` = `https://your-project.vercel.app` or custom domain  
- `NEXT_PUBLIC_SITE_URL` = same as public URL  
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (for seeding; seed is run once from your machine)

### 4. Push schema (from your laptop)

```bash
# Point .env at the same DATABASE_URL Vercel uses
npx prisma db push
npm run db:seed
```

### 5. Deploy

Vercel auto-deploys on `git push`. Or:

```bash
npx vercel --prod
```

### 6. Custom domain

Vercel → Project → **Domains** → add `autopacbd.com` → set DNS as shown.

### 7. Optional `vercel.json`

A minimal config is in the repo root (`vercel.json`) so builds always run Prisma generate.

---

## Recommended production topology

```
DNS → ExonHost cPanel (Node.js + MySQL + uploads)
        └── https://autopacbd.com
        └── https://autopacbd.com/admin
```

Use **Vercel only** for:

- Preview deployments of UI PRs, or  
- A static/marketing mirror **without** relying on admin uploads  

If you want Vercel as the live site later, plan **object storage** for `/uploads` first.

---

## Smoke test after any deploy

1. Home page loads (EN + BN).  
2. `/admin/login` → dashboard.  
3. Admin → Company → change logo → hard-refresh homepage → logo updates.  
4. Admin → Website content → save → homepage copy updates.  
5. Request quote form submits.  
6. Catalog / brochure pages open.

---

## Common failures

| Symptom | Fix |
|---------|-----|
| `P1000` / auth failed MySQL | Wrong `DATABASE_URL` password or Remote MySQL IP not allowed |
| Admin login loops | `NEXTAUTH_URL` must match the live HTTPS URL; strong `NEXTAUTH_SECRET` |
| Build fails on Prisma | Run `prisma generate` in build; ensure `DATABASE_URL` exists at build if required |
| Logo/content not updating | Hard refresh; unregister old service worker; confirm CMS APIs are same-origin |
| 502 / app won’t start on cPanel | Wrong startup file (use `server.js`); rebuild; check Passenger/Node logs |
| Uploads work then vanish (Vercel) | Expected — use ExonHost or external storage |

---

## Quick commands reference

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
npm start                 # production via server.js (cPanel)
```
