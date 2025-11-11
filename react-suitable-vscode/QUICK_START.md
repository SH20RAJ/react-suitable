# 🚀 Suitable VS Code Extension - Quick Start Guide

## Overview
The Suitable VS Code Extension brings the power of the Suitable CLI directly into your VS Code editor, allowing you to fix React ESLint issues with just a keyboard shortcut!

## ⚡ Getting Started (2 minutes)

### 1. Install Suitable CLI (if not already installed)
```bash
# Option 1: Global installation (recommended)
npm install -g suitable

# Option 2: Project local (works with npx)
npm install --save-dev suitable

# Option 3: No installation needed - extension will use npx
```

### 2. Set Up the Extension for Development
```bash
# Navigate to the extension directory
cd react-suitable-vscode

# Install dependencies (if not done already)
npm install

# Compile TypeScript (if not done already) 
npm run compile

# Open in VS Code
code .
```

### 3. Launch Extension Development Host
- In VS Code, press `F5` or go to `Run > Start Debugging`
- This opens a new "Extension Development Host" window
- Open any React/JavaScript project in this new window

### 4. Test the Extension
- Open a React file with unused imports (`.js`, `.jsx`, `.ts`, or `.tsx`)
- Press `Ctrl+Shift+Alt+F` (Mac: `Cmd+Shift+Alt+F`) to fix the current file
- Or open Command Palette (`Ctrl+Shift+P`) and search for "Suitable"

## 🎮 Available Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| **Fix Current File** | `Ctrl+Shift+Alt+F` | Fix ESLint issues in the active file |
| **Fix Workspace** | `Ctrl+Shift+Alt+W` | Fix all supported files in workspace |
| **Interactive Mode** | Command Palette | Guided configuration and execution |
| **Dry Run** | Command Palette | Preview changes without applying |
| **Open Settings** | Command Palette | Quick access to extension settings |

## 🔧 Configuration

Access via `File > Preferences > Settings` (search "suitable"):

```json
{
  "suitable.autoFixOnSave": false,
  "suitable.enableNotifications": true,
  "suitable.includePatterns": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  "suitable.excludePatterns": ["node_modules/**", "build/**", "dist/**"],
  "suitable.focusAreas": ["unused-imports", "unused-vars", "formatting"]
}
```

## 🧪 Testing Scenarios

### Create Test Files
```javascript
// test-file.jsx - Create this in your test project
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

function TestComponent() {
  const [count, setCount] = useState(0);
  const unusedVar = "this will be removed";
  
  return <div>Count: {count}</div>;
}

export default TestComponent;
```

### Test Commands
1. **Fix Current File**: `Ctrl+Shift+Alt+F` - Should remove unused imports
2. **Dry Run**: Command Palette > "Suitable: Dry Run" - Should show what would be fixed
3. **Context Menu**: Right-click file > "Fix Current File"

## 🔍 Troubleshooting

### Extension Not Working?
1. **Check File Type**: Only works with `.js`, `.jsx`, `.ts`, `.tsx` files
2. **Check Output Panel**: View > Output > Select "Suitable" from dropdown
3. **Restart Extension**: `Ctrl+Shift+P` > "Developer: Reload Window"

### CLI Issues?
```bash
# Test if Suitable CLI is accessible
suitable --version

# If not found, install globally
npm install -g suitable
```

### No Workspace Found?
- Open a folder in VS Code (File > Open Folder)
- Extensions need a workspace context to operate on multiple files

## 📊 Expected Results

After running "Fix Current File" on the test file above:
```javascript
// Fixed file - unused imports removed
import { useState } from 'react';

function TestComponent() {
  const [count, setCount] = useState(0);
  
  return <div>Count: {count}</div>;
}

export default TestComponent;
```

## 🎯 Next Steps

Once you've verified the extension works:

1. **Package Extension** (optional):
```bash
npm install -g @vscode/vsce
vsce package
```

2. **Install Packaged Extension**:
```bash
code --install-extension suitable-vscode-1.0.0.vsix
```

3. **Use in Real Projects**: Test with your actual React projects!

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Suitable command not found" | Install Suitable CLI: `npm install -g suitable` |
| Extension doesn't activate | Open a `.js/.jsx/.ts/.tsx` file |
| No context menu option | Right-click on supported file types only |
| Progress notifications don't show | Check notification settings in VS Code |

## 🆘 Getting Help

- **Check Output Panel**: View detailed logs in "Suitable" output channel
- **Extension Logs**: Enable developer tools if needed
- **Test CLI Directly**: Run `suitable --help` to verify CLI installation

---

**✨ You're ready to use Suitable VS Code Extension! Happy coding! ⚛️**