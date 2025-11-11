const fs = require('fs');
const path = require('path');

console.log('🔨 Building Suitable...');

// Make CLI executable
const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');
if (fs.existsSync(cliPath)) {
  fs.chmodSync(cliPath, '755');
  console.log('✓ Made CLI executable');
}

// Validate package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.bin || !packageJson.bin.suitable) {
  console.error('❌ Missing bin configuration in package.json');
  process.exit(1);
}

// Check if all required files exist
const requiredFiles = [
  'bin/cli.js',
  'src/index.js',
  'src/config.js',
  'src/interactive.js',
  'README.md'
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
}

console.log('✅ Build completed successfully!');
console.log('📦 Ready for publishing with: npm publish');