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

## Deployment to cPanel (ExonHost)
Since this project uses Next.js with a custom server (`server.js` specified in package.json start script), make sure you have:
1. Node.js setup app installed on cPanel.
2. Build the app locally or on the server: `npm run build`
3. Set the production environment variables in the cPanel Node.js App interface.
4. Set the startup file to `server.js` or `node_modules/next/dist/bin/next` depending on your specific cPanel PM2 configuration.

## Features
- **Bilingual System:** Fully supports English and Bengali (বাংলা) via context based language toggle.
- **Theme Support:** Dark and Light mode powered by `next-themes` and `Tailwind`.
- **Modern UI:** Clean, industrial look utilizing Tailwind CSS and smooth animations via `Framer Motion`.
- **Admin Dashboard:** Secure CMS with `NextAuth.js`.
- **Lead Generation:** Quotation request form backed by `Zod` validation and DB storage.
- **WhatsApp Integration:** Floating action buttons and direct message links.
- **SEO Optimized:** Dynamic Metadata, Sitemap, and robots.txt.
