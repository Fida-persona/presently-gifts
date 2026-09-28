# Presently — Gifts for Every Occasion

A full-stack e-commerce storefront for gifting, with an admin panel for managing inventory. Built with Next.js, Tailwind CSS, Framer Motion, and a Turso (libSQL) database.

## Features

- **Storefront**: animated hero, 18 occasion pages (Birthday, Anniversary, Wedding, Diwali, Christmas, and more), 12 categories, filtering/sorting/search, product detail pages, cart, checkout, and an animated order confirmation.
- **Admin panel** (`/admin`, password-protected): dashboard with stats and low-stock alerts, full CRUD for products/occasions/categories, and order status management.
- Dummy catalog of 61 products seeded automatically on first run — replace with your own via the admin panel.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Turso (libSQL) via `@libsql/client` · Server Actions (no separate API layer)

## Getting started

1. **Create a Turso database** (free tier is plenty):
   ```bash
   turso auth login
   turso db create presently-gifts
   turso db show presently-gifts --url
   turso db tokens create presently-gifts
   ```

2. **Set environment variables** — copy `.env.example` to `.env.local` and fill in:
   ```
   TURSO_DATABASE_URL=libsql://...
   TURSO_AUTH_TOKEN=...
   ADMIN_PASSWORD=choose-a-real-password
   ADMIN_SESSION_SECRET=a-long-random-string
   ```

3. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```

The database schema and dummy product catalog are created automatically on first request.

## Admin panel

Visit `/admin`, log in with `ADMIN_PASSWORD`, and manage products, occasions, categories, and orders. Product images are added as URLs (paste a hosted image link per line) rather than file uploads.

## Deploying

This app is built to run on serverless platforms like Vercel — all database access goes through Turso's HTTP client, so there's no local file/disk dependency.

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy.

## Notes

All product data is dummy/sample data for demonstration. Checkout is a demo flow — no real payment is processed.
