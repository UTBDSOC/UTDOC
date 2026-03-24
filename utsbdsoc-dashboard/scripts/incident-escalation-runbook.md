# Incident Escalation Runbook

## Severity definitions

- **SEV1**: Complete outage or critical data/security impact.
- **SEV2**: Major feature unavailable or severe degradation.
- **SEV3**: Partial degradation with workaround available.
- **SEV4**: Low-impact issue; monitor and schedule fix.

## Response flow

1. Create a GitHub issue using `Production Incident` template.
2. Assign incident commander and communications owner.
3. Post initial update with severity, impact, and ETA for next update.
4. Begin mitigation and track timeline in incident issue.
5. Escalate to backend/frontend owners based on impacted surface.
6. Resolve, monitor for recurrence, then close with postmortem actions.

## Update cadence

- SEV1: every 15 minutes
- SEV2: every 30 minutes
- SEV3/SEV4: hourly or at key milestones

## Minimum checklist

- Confirm health endpoint status
- Confirm auth and dashboard routes
- Confirm cron jobs and API headers
- Confirm logs and alerting channels
- Record root cause and prevention tasks
