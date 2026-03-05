# TreasurerOfBharat

A Next.js 14 dashboard application built with TypeScript, featuring authentication, internationalization (i18n), and a modern UI with Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI, Lucide icons, Framer Motion
- **Auth:** NextAuth.js v5
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

Copy `.env.example` to `.env.local` and configure any required keys (e.g. NextAuth, APIs).

## Deploy

- **Vercel:** Connect this repo to [Vercel](https://vercel.com) for one-click deploy.
- **Other:** Run `npm run build` and `npm start` in your hosting environment.

## License

Private — TreasurerOfBharat.
