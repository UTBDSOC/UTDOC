const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\wasif\\OneDrive\\Desktop\\teehee\\03 Projects\\UTDOC\\utsbdsoc-dashboard';
const dirs = [
  'tests',
  'tests/unit',
  'tests/unit/components',
  'tests/integration',
  'tests/e2e',
  'tests/utils'
];

dirs.forEach(dir => {
  const fullPath = path.join(basePath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log('Created: ' + fullPath);
});

console.log('\nAll directories created successfully!');
