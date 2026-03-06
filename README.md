# TreasurerOfBharat

A Next.js 14 dashboard application built with TypeScript, featuring authentication, internationalization (i18n), and a modern UI with Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI, Lucide icons, Framer Motion
- **Auth:** NextAuth.js v5 (Credentials + optional Google/GitHub)
- **Database:** Prisma + PostgreSQL (users stored in DB; password hashing via bcrypt)
- **i18n:** next-intl (multi-locale support)
- **State:** Jotai
- **Forms:** React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Database setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (PostgreSQL connection string).
2. Run migrations to create the `User` table:

```bash
npx prisma migrate deploy
```

For local development you can use a hosted PostgreSQL (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com)) or a local Postgres instance.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

- `app/[locale]/` — Locale-based routes (auth, protected app, ecommerce, etc.)
- `components/` — Reusable UI components, partials (header, sidebar, auth forms)
- `providers/` — Theme, auth, direction (RTL), mounted providers
- `hooks/` — Custom React hooks
- `i18n/` — Internationalization config and routing

## Environment

Copy `.env.example` to `.env` and configure:

- **DATABASE_URL** — PostgreSQL connection string (required for auth and registration).
- **NEXTAUTH_SECRET** — Long random string for signing sessions (use `openssl rand -base64 32`).
- **NEXTAUTH_URL** — App URL (e.g. `http://localhost:3000` in dev).

Optional: OAuth provider env vars if you use Google/GitHub login.

## Deploy

- **Vercel:** Connect this repo to [Vercel](https://vercel.com) for one-click deploy.
- **Other:** Run `npm run build` and `npm start` in your hosting environment.

## License

Private — TreasurerOfBharat.
