/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Directories to create
const dirs = [
  '.vscode',
  '.husky',
  'tests',
  'tests/unit',
  'tests/unit/components',
  'tests/integration',
  'tests/e2e',
  'tests/utils'
];

console.log('Creating directories...\n');

dirs.forEach(dir => {
  const fullPath = path.resolve(dir);
  try {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log(`→ Already exists: ${dir}`);
    } else {
      console.error(`✗ Error creating ${dir}:`, error.message);
    }
  }
});

console.log('\nAll directories ready!');

// Create VS Code settings
const vscodeSettings = {
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
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[markdown]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
};

const vscodeExtensions = {
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode", 
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright",
    "vitest.explorer"
  ]
};

// Write VS Code files
fs.writeFileSync('.vscode/settings.json', JSON.stringify(vscodeSettings, null, 2));
console.log('✓ Created: .vscode/settings.json');

fs.writeFileSync('.vscode/extensions.json', JSON.stringify(vscodeExtensions, null, 2));
console.log('✓ Created: .vscode/extensions.json');

// Create Husky hooks
const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`;

const commitMsg = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Conventional commit pattern
COMMIT_MSG=$(cat "$1")
PATTERN="^(feat|fix|docs|style|refactor|test|chore|ci|perf)(\\(.+\\))?!?: .{1,100}$"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Expected: type(scope): description"
  echo "Types: feat, fix, docs, style, refactor, test, chore, ci, perf"
  echo "Example: feat(events): add event creation form"
  exit 1
fi
`;

fs.writeFileSync('.husky/pre-commit', preCommit);
console.log('✓ Created: .husky/pre-commit');

fs.writeFileSync('.husky/commit-msg', commitMsg);
console.log('✓ Created: .husky/commit-msg');

console.log('\n✅ Setup complete! Run: npm install -D husky lint-staged @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8');
