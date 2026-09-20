# AutoPac - Modern Industrial Website

This project is a modern, high-converting, professional website for AutoPac (Bangladesh-based food processing and packaging machinery supplier). 

Built using Next.js 14 (App Router), Tailwind CSS, MySQL, Prisma, NextAuth, Framer Motion, React Hook Form, and Zod.

## Setup Instructions

### 1. Requirements
- Node.js (v18.17+)
- MySQL Database

### 2. Environment Variables
Create a `.env` file in the root directory (you can copy from `.env.example`):
```env
# Example MySQL Database connection
DATABASE_URL="mysql://root:password@localhost:3306/autopac_db"

# NextAuth Configuration
NEXTAUTH_SECRET="your_super_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Ensure your MySQL server is running, then execute the following commands to create the tables:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Full guides for **ExonHost cPanel** and **Vercel**: see **[DEPLOY.md](./DEPLOY.md)**.

### Quick pointers
- **cPanel (recommended for production):** Node 18+, startup file `server.js`, MySQL via cPanel, then `npm install` → `npx prisma db push` → `npm run db:seed` → `npm run build` → Restart app.
- **Vercel:** Import Git repo, set env vars, use remote MySQL. Media uploads to disk do not persist on Vercel — prefer cPanel for the live CMS.

## Features
- **Bilingual System:** Fully supports English and Bengali (বাংলা) via context based language toggle.
- **Theme Support:** Dark and Light mode powered by `next-themes` and `Tailwind`.
- **Modern UI:** Clean, industrial look utilizing Tailwind CSS and smooth animations via `Framer Motion`.
- **Admin Dashboard:** Secure CMS with `NextAuth.js`.
- **Lead Generation:** Quotation request form backed by `Zod` validation and DB storage.
- **WhatsApp Integration:** Floating action buttons and direct message links.
- **SEO Optimized:** Dynamic Metadata, Sitemap, and robots.txt.
