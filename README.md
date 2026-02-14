# Auto Pac – World Class Food Processing & Packaging Machinery Website

A fully dynamic, bilingual (English/Bengali) industrial business showcase for Auto Pac machinery. Built with Next.js 14, Prisma, Tailwind CSS, and TypeScript.

## Features

- **Fully Dynamic CMS** – Admin panel for products, hero slider, trusted partners, company profile, industries, owner profile
- **Bilingual** – Full toggle between English (EN) and Bengali (বাংলা)
- **Logo Branding** – Dynamic logo from admin, industrial color palette
- **Trusted Partners** – Animated marquee carousel (BSMTI, SME Foundation, etc.)
- **Industries Section** – Food & Beverage, Pharma, Cosmetics, Industrial
- **Owner Profile** – Leadership section on About page
- **WhatsApp** – Floating button + sticky mobile CTAs
- **Conversion-Focused** – Request Quote, Inquire on WhatsApp
- **Mobile-First** – Responsive, fast, professional industrial design

## Quick Start

```bash
npm install
cp .env.example .env   # Edit ADMIN_PASSWORD
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin Panel (`/admin`)

- **Login**: Default password `autopac2025` (set `ADMIN_PASSWORD` in `.env`)
- **Products** – List (add/edit via API)
- **Hero Slider** – Edit titles, images, order
- **Trusted Partners** – Logos, names, links
- **Company Profile** – Logo, tagline, address, phone, email, WhatsApp
- **Industries** – Industries we serve
- **Owner Profile** – Photo, bio, leadership message

## Database

- SQLite (`prisma/dev.db`) for development
- Run `npx prisma db push` after schema changes
- Run `npx tsx prisma/seed.ts` to seed initial data

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── products/       # Catalog & product detail
│   ├── about/          # About Us + Owner
│   └── contact/        # Contact + lead form
├── components/         # Header, HeroSlider, TrustedPartners, etc.
├── context/            # LocaleContext (i18n)
├── hooks/              # useSiteData (API + fallback)
├── lib/                # Prisma, API types
└── data/               # Static fallback data
```

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma DB URL (default: `file:./dev.db`) |
| `ADMIN_PASSWORD` | Admin login password |
| `NEXT_PUBLIC_SITE_URL` | Site URL for API calls (e.g. `http://localhost:3000`) |

## Contact Form

Replace `your-form-id` in `src/app/contact/page.tsx` with your Formspree form ID.

## Future Expansion Ready

Architecture supports: AI recommendations, client dashboard, dealer portal, RFQ automation, blog, case studies, CRM integration.
