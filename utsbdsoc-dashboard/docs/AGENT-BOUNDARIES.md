# Agent Boundaries

## Claude Code (Backend)

Owns:

- `prisma/`
- `src/lib/` (backend service logic)
- `src/app/api/`

## Gemini CLI (Frontend)

Owns:

- `src/components/`
- `src/app/(pages)/`
- `src/styles/`

## Copilot (Testing, Utilities, CI)

Owns:

- `tests/` and `__tests__/`
- `.github/`
- `scripts/`
- test configs (`vitest.config.ts`, `playwright.config.ts`)
- lint/format configs
- `docs/`

## Rules

- If a failure originates in another owner’s path, report root cause and handoff.
- Do not directly modify non-owned areas unless explicitly requested.
