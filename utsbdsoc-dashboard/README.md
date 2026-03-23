## UTSBDSOC Dashboard

Event management dashboard for UTS Bangladeshi Society.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality and Test Commands

```bash
npm run lint
npm run type-check
npm run test:coverage
npm run e2e -- --project=chromium
```

## Production Readiness Commands

```bash
npm run env:check
npm run security:check
npm run analyze
npm run lighthouse
HEALTHCHECK_URL=https://your-domain/api/health npm run health:check
```

## CI/CD

- `.github/workflows/ci.yml`: lint, test, build, e2e, lighthouse
- `.github/workflows/db-migrate.yml`: manual Prisma deploy migration
- `.github/dependabot.yml`: weekly dependency updates

## Deployment Runbook

See `scripts/deployment-runbook.md`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Error Tracking (Sentry)

Recommended production setup:

- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

Add Sentry SDK setup later in frontend/backend owner files; these environment variables are pre-documented in `.env.example`.
