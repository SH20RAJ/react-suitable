# Suitable 🔧

A powerful CLI tool that automatically fixes common ESLint issues in React projects. Say goodbye to unused imports, unused variables, and other linting headaches!

[![Visitors](https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fgithub.com%2Fsh20raj%2Freact-suitable%2F&countColor=%23263759&style=plastic)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Fsh20raj%2Freact-suitable%2F)
[![npm version](https://badge.fury.io/js/react-suitable.svg)](https://badge.fury.io/js/react-suitable)
[![Downloads](https://img.shields.io/npm/dm/react-suitable.svg)](https://www.npmjs.com/package/react-suitable)
[![GitHub stars](https://img.shields.io/github/stars/sh20raj/react-suitable?style=social)](https://github.com/sh20raj/react-suitable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🧹 Auto-fix unused imports** - Removes all unused import statements
- **🗑️ Remove unused variables** - Eliminates unused variables and parameters
- **⚛️ React-optimized** - Built specifically for React, Next.js, and TypeScript projects
- **🎯 Smart detection** - Automatically detects your project type and applies appropriate rules
- **🔄 Interactive mode** - Menu-driven approach for customized fixing
- **🏃‍♂️ Fast & efficient** - Processes large codebases quickly
- **📊 Detailed reporting** - Shows exactly what was fixed
- **🔧 Configurable** - Use your existing ESLint config or our optimized defaults

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g suitable

# Or run with npx (no installation needed)
npx suitable
```

### Basic Usage

```bash
# Fix issues in current directory
suitable

# Fix issues in specific directory
suitable ./src

# Interactive mode with menu
suitable --interactive

# Dry run (see what would be fixed without changing files)
suitable --dry-run

# Use custom ESLint config
suitable --config ./my-eslint-config.js
```

### Quick Demo

Test it on any React project:

```bash
# Navigate to your React project
cd my-react-app

# See what issues can be fixed (dry run)
npx suitable --dry-run

# Fix all auto-fixable issues
npx suitable

# Use interactive mode for customization
npx suitable --interactive
```

## 📋 Command Line Options

| Option                 | Description                                     | Default                            |
| ---------------------- | ----------------------------------------------- | ---------------------------------- |
| `--interactive, -i`    | Run in interactive mode with menu               | `false`                            |
| `--dry-run`            | Show what would be fixed without making changes | `false`                            |
| `--config <path>`      | Path to custom ESLint configuration file        | Auto-detect                        |
| `--include <patterns>` | File patterns to include (comma-separated)      | `**/*.{js,jsx,ts,tsx}`             |
| `--exclude <patterns>` | File patterns to exclude (comma-separated)      | `node_modules/**,build/**,dist/**` |
| `--fix, -f`            | Automatically fix issues                        | `true`                             |

## 🎮 Interactive Mode

Launch interactive mode for a guided experience:

```bash
suitable --interactive
```

The interactive mode will:

1. **Detect your project type** (React, Next.js, TypeScript)
2. **Configure ESLint rules** based on your project
3. **Select file patterns** to process
4. **Choose fix options** (auto-fix, dry-run, focus areas)
5. **Show summary** and ask for confirmation
6. **Execute** the fixes with your chosen configuration

## 🔧 What Gets Fixed

### Unused Imports

```javascript
// Before
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// After
import { useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

### Unused Variables

```javascript
// Before
function processData(items, config, options) {
  const result = [];
  const temp = "unused";

  items.forEach((item) => {
    result.push(item.name);
  });

  return result;
}

// After
function processData(items) {
  const result = [];

  items.forEach((item) => {
    result.push(item.name);
  });

  return result;
}
```

### Code Formatting

- Removes trailing spaces
- Fixes indentation
- Adds missing semicolons
- Standardizes quotes
- Fixes object/array spacing

### React-Specific Issues

- Removes unused React imports (React 17+)
- Fixes React Hooks rules violations
- Optimizes JSX prop usage
- Removes unused component props

## 🛠️ Configuration

### Default Configuration

Suitable comes with sensible defaults optimized for React projects:

```javascript
{
  // Focus on unused code removal
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': 'error',

  // React optimizations
  'react/react-in-jsx-scope': 'off', // React 17+
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',

  // Auto-fixable formatting
  'no-trailing-spaces': 'error',
  'semi': 'error',
  'quotes': ['error', 'single'],
  // ... and more
}
```

### Custom Configuration

Use your existing ESLint config:

```bash
suitable --config ./.eslintrc.js
```

Or create a project-specific config that extends Suitable's defaults:

```javascript
// .eslintrc.js
module.exports = {
  extends: ["suitable/react"], // Use Suitable's React preset
  rules: {
    // Your custom rules
    "no-console": "warn",
  },
};
```

## 🏗️ Project Structure Support

Suitable works with various project structures:

```
your-react-project/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── pages/
├── public/
├── package.json
└── .eslintrc.js (created if not exists)
```

## 🔧 IDE Integration

### VS Code Extension

Get the official Suitable VS Code extension for seamless integration:

```bash
# Navigate to extension directory
cd react-suitable-vscode

# Install dependencies and compile
npm install && npm run compile

# Development mode (opens Extension Development Host)
# Press F5 in VS Code or use "Run > Start Debugging"
```

**Extension Features:**
- **Fix Current File**: `Ctrl+Shift+Alt+F` (Mac: `Cmd+Shift+Alt+F`)
- **Fix Workspace**: `Ctrl+Shift+Alt+W` (Mac: `Cmd+Shift+Alt+W`)  
- **Interactive Mode**: Guided configuration and execution
- **Dry Run**: Preview changes before applying
- **Auto-fix on Save**: Optional automatic fixing when saving files
- **Context Menu Integration**: Right-click options for supported files
- **Output Panel**: Detailed logging in "Suitable" output channel

Configure via VS Code Settings:
```json
{
  "suitable.autoFixOnSave": false,
  "suitable.enableNotifications": true,
  "suitable.includePatterns": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  "suitable.excludePatterns": ["node_modules/**", "build/**", "dist/**"]
}
```


### Fix a Create React App project

```bash
cd my-cra-app
suitable
```

### Fix a Next.js project with TypeScript

```bash
cd my-nextjs-app
suitable --interactive  # Will detect Next.js and suggest appropriate config
```

### Fix specific directories only

```bash
suitable --include "src/**/*.{ts,tsx}" --exclude "src/**/*.test.ts"
```

### See what would be fixed without making changes

```bash
suitable --dry-run
```

## 📊 Output Example

```
🔧 Suitable - React ESLint Auto-fixer
Fixing common linting issues in your React project...

✓ ESLint configuration ready
✓ Processing complete: 47 issues fixed in 23 files

# ✨ Summary

Files processed: 23
Issues fixed: 47
Unused imports removed: 18
Unused variables removed: 12
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋‍♀️ Support

- 🐛 [Report bugs](https://github.com/sh20raj/react-suitable/issues)
- 💡 [Request features](https://github.com/sh20raj/react-suitable/issues)
- 📚 [Documentation](https://github.com/sh20raj/react-suitable/wiki)

## 🎯 Roadmap

- [x] **VS Code extension** - Official VS Code extension for seamless editor integration
- [ ] Git hook integration
- [ ] CI/CD pipeline integration
- [ ] More framework support (Vue, Angular)
- [ ] Custom rule templates
- [ ] Performance optimizations for large codebases

---

Made with ❤️ for the React community
