import * as fs from "node:fs";
import * as path from "node:path";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env.local");
const vercelPath = path.join(rootDir, "vercel.json");

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

const checks: Check[] = [];

const envFile = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const hasCronSecret = /(^|\n)CRON_SECRET=.+/m.test(envFile);
checks.push({
  name: "CRON_SECRET configured",
  ok: hasCronSecret,
  detail: hasCronSecret
    ? "CRON_SECRET found in .env.local"
    : "Missing CRON_SECRET in .env.local",
});

const sentryVars = [
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_AUTH_TOKEN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
];

const missingSentry: string[] = [];
for (const envVar of sentryVars) {
  const exists = new RegExp(`(^|\\n)${envVar}=.+`, "m").test(envFile);
  checks.push({
    name: `Sentry variable: ${envVar}`,
    ok: exists,
    detail: exists ? "Configured in .env.local" : "Missing in .env.local",
  });
  if (!exists) missingSentry.push(envVar);
}

let vercelConfig: Record<string, unknown> | null = null;
if (fs.existsSync(vercelPath)) {
  vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf8"));
}

const apiHeaders: Array<{ key: string; value: string }> =
  (vercelConfig?.headers as Array<{ source: string, headers: Array<{key: string, value: string}> }> | undefined)?.find((h) => h.source === "/api/(.*)")?.headers ?? [];

const requiredHeaders = [
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
];

for (const header of requiredHeaders) {
  const exists = apiHeaders.some((h) => h.key === header);
  checks.push({
    name: `Security header: ${header}`,
    ok: exists,
    detail: exists ? "Configured in vercel.json" : "Missing in vercel.json headers",
  });
}

const requiredFiles = [
  ".github/workflows/ci.yml",
  ".github/dependabot.yml",
  "playwright.config.ts",
  "vitest.config.ts",
];

for (const file of requiredFiles) {
  const exists = fs.existsSync(path.join(rootDir, file));
  checks.push({
    name: `Required file: ${file}`,
    ok: exists,
    detail: exists ? "Present" : "Missing",
  });
}

console.log(`${colors.bold}${colors.blue}Production Security Check${colors.reset}\n`);
for (const check of checks) {
  const icon = check.ok ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  console.log(`${icon} ${check.name}`);
  console.log(`  ${check.detail}`);
}

const failed = checks.filter((c) => !c.ok);
const nonSentryFailures = failed.filter((c) => !c.name.startsWith("Sentry variable:"));
if (nonSentryFailures.length > 0) {
  console.log(
    `\n${colors.red}${colors.bold}Failed ${nonSentryFailures.length} required security check(s).${colors.reset}`
  );
  process.exit(1);
}

if (missingSentry.length > 0) {
  const isCI = process.env.CI === "true";
  const level = isCI ? colors.red : colors.yellow;
  console.log(
    `\n${level}${colors.bold}Sentry production variables missing: ${missingSentry.join(
      ", "
    )}${colors.reset}`
  );
  if (isCI) {
    process.exit(1);
  }
}

console.log(`\n${colors.green}${colors.bold}All security checks passed.${colors.reset}`);
