import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Load environment variables from .env.local or .env
const rootDir = path.resolve(__dirname, '..');
const envLocalPath = path.join(rootDir, '.env.local');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log(`${colors.cyan}Loaded environment from .env.local${colors.reset}\n`);
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`${colors.cyan}Loaded environment from .env${colors.reset}\n`);
} else {
  console.log(`${colors.yellow}Warning: No .env.local or .env file found${colors.reset}\n`);
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

console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}${colors.blue}                 Environment Variables Check                ${colors.reset}`);
console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

// Check required variables
console.log(`${colors.bold}Required Variables:${colors.reset}\n`);

const missingRequired: string[] = [];

for (const envVar of requiredVars) {
  const result = checkEnvVar(envVar);

  if (result.found) {
    const altNote = result.usedName !== envVar.name ? ` (using ${result.usedName})` : '';
    console.log(`  ${colors.green}✓${colors.reset} ${envVar.name}${altNote}`);
    if (envVar.description) {
      console.log(`    ${colors.cyan}${envVar.description}${colors.reset}`);
    }
  } else {
    console.log(`  ${colors.red}✗${colors.reset} ${envVar.name}`);
    if (envVar.alternatives) {
      console.log(`    ${colors.yellow}(or: ${envVar.alternatives.join(', ')})${colors.reset}`);
    }
    if (envVar.description) {
      console.log(`    ${colors.cyan}${envVar.description}${colors.reset}`);
    }
    missingRequired.push(envVar.name);
  }
  console.log();
}

// Check optional variables
console.log(`${colors.bold}Optional Variables:${colors.reset}\n`);

for (const envVar of optionalVars) {
  const result = checkEnvVar(envVar);

  if (result.found) {
    console.log(`  ${colors.green}✓${colors.reset} ${envVar.name}`);
  } else {
    console.log(`  ${colors.yellow}○${colors.reset} ${envVar.name} ${colors.yellow}(not set)${colors.reset}`);
  }
  if (envVar.description) {
    console.log(`    ${colors.cyan}${envVar.description}${colors.reset}`);
  }
  console.log();
}

console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

// Summary and exit
if (missingRequired.length > 0) {
  console.log(`${colors.red}${colors.bold}Error: Missing ${missingRequired.length} required environment variable(s):${colors.reset}`);
  console.log(`  ${colors.red}${missingRequired.join(', ')}${colors.reset}\n`);
  console.log(`${colors.yellow}Please add the missing variables to .env.local or .env${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}${colors.bold}✓ All required environment variables are set!${colors.reset}\n`);
  process.exit(0);
}
