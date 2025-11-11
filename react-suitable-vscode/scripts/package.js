const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Packaging Suitable VS Code Extension...');

try {
    // Ensure TypeScript is compiled
    console.log('🔨 Compiling TypeScript...');
    execSync('npm run compile', { stdio: 'inherit' });
    
    // Package the extension
    console.log('📦 Creating VSIX package...');
    execSync('vsce package --no-dependencies', { stdio: 'inherit' });
    
    console.log('✅ Extension packaged successfully!');
    console.log('📋 To install: code --install-extension suitable-vscode-1.0.0.vsix');
    
} catch (error) {
    console.error('❌ Packaging failed:', error.message);
    process.exit(1);
}