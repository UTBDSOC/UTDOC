const fs = require('fs');
const path = require('path');

// Create directories
const dirs = ['.vscode', '.github/workflows', 'scripts'];
dirs.forEach(d => {
  fs.mkdirSync(d, { recursive: true });
  console.log('Created directory:', d);
});

// File contents
const files = {
  '.vscode/settings.json': `{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\\\(([^)]*)\\\\)", "(?:'|\\"|\\`)([^']*)(?:'|\\"|\\`)"],
    ["cn\\\\(([^)]*)\\\\)", "(?:'|\\"|\\`)([^']*)(?:'|\\"|\\`)"]
  ],
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[markdown]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
`,

  '.vscode/extensions.json': `{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode", 
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright",
    "vitest.explorer",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker"
  ]
}
`,

  '.github/dependabot.yml': `version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "09:00"
      timezone: Australia/Sydney
    open-pull-requests-limit: 10
    groups:
      minor-and-patch:
        update-types:
          - minor
          - patch
      major:
        update-types:
          - major
    labels:
      - dependencies
      - automated
    commit-message:
      prefix: "chore(deps)"
`,

  '.github/workflows/ci.yml': `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run ESLint
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Check Formatting
        run: npm run format:check

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
`,

  '.github/workflows/db-migrate.yml': `name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy migrations to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  migrate:
    name: Run Prisma Migrations
    runs-on: ubuntu-latest
    environment: \${{ github.event.inputs.environment }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run Migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
`,

  'scripts/check-env.ts': `import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes
const colors = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  cyan: '\\x1b[36m',
  bold: '\\x1b[1m',
};

// Load environment variables from .env.local or .env
const rootDir = path.resolve(__dirname, '..');
const envLocalPath = path.join(rootDir, '.env.local');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log(\`\${colors.cyan}Loaded environment from .env.local\${colors.reset}\\n\`);
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(\`\${colors.cyan}Loaded environment from .env\${colors.reset}\\n\`);
} else {
  console.log(\`\${colors.yellow}Warning: No .env.local or .env file found\${colors.reset}\\n\`);
}

interface EnvVar {
  name: string;
  alternatives?: string[];
  description?: string;
}

const requiredVars: EnvVar[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    alternatives: ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'],
    description: 'Supabase anonymous/public key',
  },
  {
    name: 'DATABASE_URL',
    description: 'PostgreSQL connection string',
  },
];

const optionalVars: EnvVar[] = [
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key for admin operations',
  },
  {
    name: 'RESEND_API_KEY',
    description: 'Resend API key for email sending',
  },
  {
    name: 'DISCORD_WEBHOOK_URL',
    description: 'Discord webhook for notifications',
  },
  {
    name: 'CRON_SECRET',
    description: 'Secret for authenticating cron job requests',
  },
];

function checkEnvVar(envVar: EnvVar): { found: boolean; usedName: string | null } {
  if (process.env[envVar.name]) {
    return { found: true, usedName: envVar.name };
  }

  if (envVar.alternatives) {
    for (const alt of envVar.alternatives) {
      if (process.env[alt]) {
        return { found: true, usedName: alt };
      }
    }
  }

  return { found: false, usedName: null };
}

console.log(\`\${colors.bold}\${colors.blue}═══════════════════════════════════════════════════════════\${colors.reset}\`);
console.log(\`\${colors.bold}\${colors.blue}                 Environment Variables Check                \${colors.reset}\`);
console.log(\`\${colors.bold}\${colors.blue}═══════════════════════════════════════════════════════════\${colors.reset}\\n\`);

// Check required variables
console.log(\`\${colors.bold}Required Variables:\${colors.reset}\\n\`);

const missingRequired: string[] = [];

for (const envVar of requiredVars) {
  const result = checkEnvVar(envVar);

  if (result.found) {
    const altNote = result.usedName !== envVar.name ? \` (using \${result.usedName})\` : '';
    console.log(\`  \${colors.green}✓\${colors.reset} \${envVar.name}\${altNote}\`);
    if (envVar.description) {
      console.log(\`    \${colors.cyan}\${envVar.description}\${colors.reset}\`);
    }
  } else {
    console.log(\`  \${colors.red}✗\${colors.reset} \${envVar.name}\`);
    if (envVar.alternatives) {
      console.log(\`    \${colors.yellow}(or: \${envVar.alternatives.join(', ')})\${colors.reset}\`);
    }
    if (envVar.description) {
      console.log(\`    \${colors.cyan}\${envVar.description}\${colors.reset}\`);
    }
    missingRequired.push(envVar.name);
  }
  console.log();
}

// Check optional variables
console.log(\`\${colors.bold}Optional Variables:\${colors.reset}\\n\`);

for (const envVar of optionalVars) {
  const result = checkEnvVar(envVar);

  if (result.found) {
    console.log(\`  \${colors.green}✓\${colors.reset} \${envVar.name}\`);
  } else {
    console.log(\`  \${colors.yellow}○\${colors.reset} \${envVar.name} \${colors.yellow}(not set)\${colors.reset}\`);
  }
  if (envVar.description) {
    console.log(\`    \${colors.cyan}\${envVar.description}\${colors.reset}\`);
  }
  console.log();
}

console.log(\`\${colors.bold}\${colors.blue}═══════════════════════════════════════════════════════════\${colors.reset}\\n\`);

// Summary and exit
if (missingRequired.length > 0) {
  console.log(\`\${colors.red}\${colors.bold}Error: Missing \${missingRequired.length} required environment variable(s):\${colors.reset}\`);
  console.log(\`  \${colors.red}\${missingRequired.join(', ')}\${colors.reset}\\n\`);
  console.log(\`\${colors.yellow}Please add the missing variables to .env.local or .env\${colors.reset}\\n\`);
  process.exit(1);
} else {
  console.log(\`\${colors.green}\${colors.bold}✓ All required environment variables are set!\${colors.reset}\\n\`);
  process.exit(0);
}
`
};

// Write all files
Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created file:', filePath);
});

console.log('\\nAll files created successfully!');
