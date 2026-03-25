# Contributing to UTSBDSOC Dashboard

## Local setup

1. Install dependencies:
   `npm install`
2. Copy envs:
   `cp .env.example .env.local` (or create `.env.local` on Windows)
3. Generate Prisma client:
   `npm run db:generate`
4. Start app:
   `npm run dev`

## Branch naming

- `feat/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`

## Pull request checklist

- Run `npm run lint`
- Run `npm run type-check`
- Run `npm run test`
- Add/update tests for behavior changes
- Keep ownership boundaries (see `docs/AGENT-BOUNDARIES.md`)

## Commit message format

Use conventional commits:

- `feat(scope): description`
- `fix(scope): description`
- `chore(scope): description`

Valid scopes include: `dashboard`, `events`, `tasks`, `eop`, `team`, `auth`, `api`, `db`, `ci`.
