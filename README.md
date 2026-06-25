# Mariam.shop

A production-ready e-commerce storefront built as a portfolio showcase with **Next.js 16**, **Tailwind CSS**, **Prisma**, and **Neon Postgres**. Clean light theme, full shopping flow, Stripe checkout, an OpenAI-powered support chatbot, and a protected admin dashboard.

> The app runs out of the box on deterministic **mock data** when no `DATABASE_URL` is set, so you can explore the UI before wiring up any external services.

## Features

- **Storefront** — homepage hero carousel, category browsing, search, sorting, and slug-based product detail pages.
- **Cart & Wishlist** — fluid client-side state powered by Zustand.
- **Reviews & Ratings** — customers can read and leave product reviews (persisted to the database).
- **Checkout** — Stripe Checkout with a webhook to record orders.
- **Authentication** — email/password auth via NextAuth (Auth.js v5) with `USER` / `ADMIN` roles.
- **Admin Dashboard** — protected area for managing products, updating order statuses, and viewing active sessions. Includes a bulk catalog import endpoint.
- **AI Chatbot** — embedded support assistant powered by OpenAI (`gpt-4o-mini`) that greets logged-in users by name and helps with shopping queries.
- **About / Contact / Legal** — supporting content pages with a functional contact form.

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)  |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS 4                      |
| Database    | Neon Postgres via Prisma 6          |
| Auth        | NextAuth / Auth.js v5               |
| Payments    | Stripe                              |
| AI          | OpenAI SDK                          |
| State       | Zustand                             |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example file and fill in the values you need:

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string. **Leave unset to run on mock data.** |
| `AUTH_SECRET` | Random 32+ char string (`npx auth secret`). |
| `AUTH_URL` | App base URL, e.g. `http://localhost:3000`. |
| `ADMIN_EMAILS` | Comma-separated emails that get the `ADMIN` role. |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe test-mode keys. |
| `OPENAI_API_KEY` | Enables the support chatbot. |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for Stripe redirects. |

### 3. Set up the database (only if `DATABASE_URL` is set)

```bash
pnpm prisma:generate   # generate the Prisma client
pnpm prisma:push       # create tables from schema.prisma
pnpm seed              # populate sample catalog data
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the dev server. |
| `pnpm build` | Generate the Prisma client and build for production. |
| `pnpm start` | Run the production build. |
| `pnpm lint` | Lint the project. |
| `pnpm typecheck` | Type-check with `tsc`. |
| `pnpm seed` | Seed the database with sample data. |
| `pnpm prisma:generate` | Generate the Prisma client. |
| `pnpm prisma:push` | Push the schema to the database. |
| `pnpm prisma:studio` | Open Prisma Studio. |

## Project Structure

```
app/            App Router pages and API routes
  admin/        Protected admin dashboard (products, orders, sessions)
  api/          Route handlers (auth, checkout, chat, reviews, webhooks…)
  products/     Catalog and product detail pages
components/     Reusable UI components
lib/            Data layer, Prisma client, mock data, types
prisma/         schema.prisma
scripts/        Seed script
```

## Data Model

Core Prisma models: `User`, `Session`, `Category`, `Product`, `Review`, `Order`, `OrderItem`, `Discount`, and `ContactMessage`. See [`prisma/schema.prisma`](prisma/schema.prisma) for the full schema.

## License

This project is a portfolio showcase. All rights reserved.

---

Built by [Maryam Mumtaz](https://maryam-mumtaz.vercel.app).
