# 📦 Suitable VS Code Extension - Installation Guide

## 🚀 Quick Installation

### Method 1: Development Installation (Recommended for Testing)

```bash
# 1. Navigate to extension directory
cd react-suitable-vscode

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run compile

# 4. Open in VS Code
code .

# 5. Press F5 to launch Extension Development Host
# This opens a new VS Code window with the extension loaded
```

### Method 2: Package and Install (For Production Use)

```bash
# 1. Install VS Code Extension CLI (if not installed)
npm install -g @vscode/vsce

# 2. Package the extension
cd react-suitable-vscode
vsce package

# 3. Install the packaged extension
code --install-extension suitable-vscode-1.0.0.vsix
```

## 📋 Prerequisites

### Required
- **Node.js** 14.0.0 or higher
- **VS Code** 1.74.0 or higher  
- **Suitable CLI** (any of the following):
  - Global: `npm install -g suitable`
  - Local: `npm install --save-dev suitable`  
  - NPX: No installation needed (extension will use `npx suitable`)

### Optional
- **TypeScript** 5.1.6+ (for development)
- **@vscode/vsce** (for packaging)

## 🔧 Installation Options

### Option A: Direct Development
Best for testing and development:

```bash
git clone <repository-url>
cd suitable/react-suitable-vscode
npm install && npm run compile
code . 
# Press F5 in VS Code
```

### Option B: Package Installation  
Best for end users:

```bash
cd react-suitable-vscode
npm install -g @vscode/vsce
vsce package --no-dependencies
code --install-extension *.vsix
```

### Option C: Marketplace Installation (Future)
When published to VS Code Marketplace:

```bash
# Search "Suitable" in VS Code Extensions
# Or install via command line:
code --install-extension suitable.suitable-vscode
```

## ✅ Verify Installation

### 1. Check Extension is Loaded
- Open VS Code Command Palette (`Ctrl+Shift+P`)
- Type "Suitable" - you should see commands available

### 2. Test with Sample File
Create a test file with unused imports:

```javascript
// test.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Test() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

Press `Ctrl+Shift+Alt+F` - unused imports should be removed.

### 3. Check Output Panel
- Go to `View > Output`
- Select "Suitable" from the dropdown
- Should show extension activity logs

## 🛠️ Troubleshooting Installation

### Extension Not Loading?
```bash
# Check VS Code version
code --version

# Ensure minimum version 1.74.0
# Update VS Code if needed
```

### TypeScript Compilation Errors?
```bash
# Clean and reinstall
rm -rf node_modules out
npm install
npm run compile
```

### CLI Not Found Errors?
```bash
# Install Suitable CLI globally
npm install -g suitable

# Verify installation
suitable --version

# Or ensure project has local installation
npm install --save-dev suitable
```

### Package Creation Fails?
```bash
# Install VSCE CLI tool
npm install -g @vscode/vsce

# Check for missing fields in package.json
vsce package --no-dependencies
```

## 📁 File Structure After Installation

### Development Installation
```
react-suitable-vscode/
├── node_modules/          # Dependencies
├── out/                   # Compiled JavaScript
├── src/                   # TypeScript source
├── package.json           # Extension manifest
└── tsconfig.json          # TypeScript config
```

### Production Installation
Extension is installed in VS Code extensions directory:
- **Windows**: `%USERPROFILE%\.vscode\extensions\`
- **macOS**: `~/.vscode/extensions/`
- **Linux**: `~/.vscode/extensions/`

## 🔄 Update Process

### Development Updates
```bash
# Pull latest changes
git pull origin main

# Recompile
npm run compile

# Reload in VS Code
# Ctrl+Shift+P > "Developer: Reload Window"
```

### Production Updates  
```bash
# Rebuild package
vsce package

# Reinstall
code --install-extension suitable-vscode-1.0.0.vsix
```

## 🗑️ Uninstallation

### Remove Development Extension
Simply close the Extension Development Host window.

### Remove Installed Extension
```bash
# Command line
code --uninstall-extension suitable.suitable-vscode

# Or via VS Code UI:
# Extensions panel > Suitable > Uninstall
```

## 🆘 Getting Help

### Installation Issues
1. **Check Prerequisites** - Node.js, VS Code versions
2. **Verify CLI Installation** - `suitable --version`
3. **Check Output Logs** - View > Output > Suitable
4. **Clean Install** - Delete node_modules, reinstall

### Runtime Issues  
1. **Check File Types** - Only works with .js, .jsx, .ts, .tsx
2. **Verify Workspace** - Open a folder/workspace in VS Code
3. **Check Settings** - File > Preferences > Settings > Suitable
4. **Restart Extension** - Reload VS Code window

### Still Need Help?
- Check the **QUICK_START.md** guide
- Review **DEVELOPMENT.md** for detailed troubleshooting
- Check project issues on GitHub

---

**🎉 Ready to use Suitable VS Code Extension! Happy coding! ⚛️✨**