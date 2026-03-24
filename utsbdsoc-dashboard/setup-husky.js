#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Husky Git Hooks Setup Script
 * 
 * This script sets up Husky with pre-commit and commit-msg hooks.
 * Run with: node setup-husky.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n📦 ${description}...`, 'cyan');
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: projectRoot,
      shell: true 
    });
    log(`✅ ${description} completed!`, 'green');
    return true;
  } catch (error) {
    log(`❌ Failed: ${description}`, 'red');
    console.error(error.message);
    return false;
  }
}

function writeFile(filePath, content, description) {
  log(`\n📝 ${description}...`, 'cyan');
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    log(`✅ Created: ${path.relative(projectRoot, filePath)}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to create: ${filePath}`, 'red');
    console.error(error.message);
    return false;
  }
}

function updatePackageJson() {
  log('\n📝 Updating package.json with prepare script...', 'cyan');
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Add prepare script
    if (!pkg.scripts) {
      pkg.scripts = {};
    }
    pkg.scripts.prepare = 'husky';
    
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    log('✅ Added "prepare": "husky" to package.json', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to update package.json', 'red');
    console.error(error.message);
    return false;
  }
}

// Pre-commit hook content
const preCommitHook = `npx lint-staged
`;

// Commit-msg hook content
const commitMsgHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Conventional commit pattern
pattern="^(feat|fix|docs|style|refactor|test|chore|ci|perf)(\\(.+\\))?: .{1,}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Commit message must follow conventional commits:"
  echo "  type(scope): description"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, test, chore, ci, perf"
  echo "Scopes: dashboard, events, tasks, eop, team, auth, api, db, ci"
  echo ""
  echo "Examples:"
  echo "  feat(events): add event creation form"
  echo "  fix(auth): resolve login redirect issue"
  echo "  chore(deps): update dependencies"
  exit 1
fi
`;

async function main() {
  log('🐶 Husky Git Hooks Setup', 'cyan');
  log('========================\n', 'cyan');

  // Step 1: Install required packages
  log('Step 1: Installing required packages...', 'yellow');
  const installSuccess = runCommand(
    'npm install --save-dev husky lint-staged prettier prettier-plugin-tailwindcss',
    'Installing husky, lint-staged, prettier, and prettier-plugin-tailwindcss'
  );
  
  if (!installSuccess) {
    log('\n⚠️  Package installation failed. You may need to run manually:', 'yellow');
    log('npm install --save-dev husky lint-staged prettier prettier-plugin-tailwindcss', 'reset');
    return;
  }

  // Step 2: Update package.json with prepare script
  log('\nStep 2: Updating package.json...', 'yellow');
  updatePackageJson();

  // Step 3: Create .husky directory
  const huskyDir = path.join(projectRoot, '.husky');
  log('\nStep 3: Creating .husky directory...', 'yellow');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
    log('✅ Created .husky directory', 'green');
  } else {
    log('✅ .husky directory already exists', 'green');
  }

  // Step 4: Initialize Husky
  log('\nStep 4: Initializing Husky...', 'yellow');
  runCommand('npx husky init', 'Initializing Husky');

  // Step 6: Create pre-commit hook
  log('\nStep 5: Creating git hooks...', 'yellow');
  writeFile(
    path.join(huskyDir, 'pre-commit'),
    preCommitHook,
    'Creating pre-commit hook'
  );

  // Step 7: Create commit-msg hook
  writeFile(
    path.join(huskyDir, 'commit-msg'),
    commitMsgHook,
    'Creating commit-msg hook'
  );

  // Summary
  log('\n========================================', 'green');
  log('🎉 Husky setup complete!', 'green');
  log('========================================\n', 'green');
  
  log('Hooks created:', 'cyan');
  log('  • .husky/pre-commit - Runs lint-staged on staged files', 'reset');
  log('  • .husky/commit-msg - Validates conventional commit messages', 'reset');
  
  log('\nConventional commit format:', 'cyan');
  log('  type(scope): description', 'reset');
  log('\n  Types: feat, fix, docs, style, refactor, test, chore, ci, perf', 'reset');
  log('  Scopes: dashboard, events, tasks, eop, team, auth, api, db, ci', 'reset');
  
  log('\nExamples:', 'cyan');
  log('  feat(events): add event creation form', 'reset');
  log('  fix(auth): resolve login redirect issue', 'reset');
  log('  chore(deps): update dependencies\n', 'reset');
}

main().catch(console.error);
