# UTSBDSOC Dashboard Deployment Runbook

## 1. Pre-deployment checks

- Run `npm run env:check`
- Run `npm run security:check`
- Run `npm run lint`
- Run `npm run type-check`
- Run `npm run test:coverage`
- Run `npm run e2e -- --project=chromium`
- Run `npm run analyze` for bundle review

## 2. Required secrets

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `CRON_SECRET`

## 3. Recommended production secrets

- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `DISCORD_WEBHOOK_URL`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

## 4. Deployment steps

1. Merge to `main` from reviewed PR.
2. Verify CI jobs pass (`lint`, `test`, `build`, `e2e`, `lighthouse`).
3. Trigger `db-migrate.yml` for target environment.
4. Confirm Vercel deployment completes successfully.
5. Validate health endpoint:
   - `HEALTHCHECK_URL=https://<deployment-domain>/api/health npm run health:check`

## 5. Post-deployment verification

- Check authentication flow (OAuth callback and session)
- Check dashboard load and event/task pages
- Check cron endpoints are protected by `CRON_SECRET`
- Confirm no client bundle contains non-`NEXT_PUBLIC_` secrets
- Review logs and alert channels (Discord/Sentry)

## 6. Rollback

1. Re-deploy previous successful Vercel build.
2. If migration introduced issue, restore DB backup and run corrective migration.
3. Post incident summary in team channel with:
   - impact
   - root cause
   - fix
   - prevention tasks
