# Suitable VS Code Extension

The official VS Code extension for **Suitable** - automatically fix common ESLint issues in React projects directly from your editor!

## Features

- **🔧 Fix Current File** - Fix ESLint issues in the currently active file
- **🌍 Fix Workspace** - Fix issues across your entire workspace
- **🎮 Interactive Mode** - Guided setup with customizable options
- **🔍 Dry Run** - Preview changes before applying fixes
- **💾 Auto-fix on Save** - Automatically fix issues when you save files
- **⚡ Fast Integration** - Uses the powerful Suitable CLI under the hood

## Quick Start

1. Install the extension
2. Open a React/JavaScript/TypeScript project
3. Use `Ctrl+Shift+Alt+F` (or `Cmd+Shift+Alt+F` on Mac) to fix the current file
4. Or open the Command Palette (`Ctrl+Shift+P`) and search for "Suitable"

## Commands

### Available Commands

- **Suitable: Fix Current File** (`Ctrl+Shift+Alt+F`)
  - Fix ESLint issues in the currently active file
  - Only works with `.js`, `.jsx`, `.ts`, `.tsx` files

- **Suitable: Fix Workspace** (`Ctrl+Shift+Alt+W`)
  - Fix issues across all supported files in your workspace
  - Respects include/exclude patterns from settings

- **Suitable: Fix Workspace (Interactive)**
  - Guided setup with configuration options
  - Choose focus areas, configuration type, and file patterns

- **Suitable: Dry Run (Preview Changes)**
  - See what would be fixed without making changes
  - Results displayed in the output panel

- **Suitable: Open Settings**
  - Quick access to extension settings

### Context Menu Integration

Right-click on supported files in the Explorer or Editor to access:
- "Fix Current File" option

## Settings

Configure the extension through VS Code Settings (`Ctrl+,` → search "Suitable"):

### Core Settings

- **`suitable.autoFixOnSave`** (default: `false`)
  - Automatically fix issues when saving files
  - ⚠️ Use with caution - always commit your work first!

- **`suitable.enableNotifications`** (default: `true`)
  - Show notifications for fix results

### File Patterns

- **`suitable.includePatterns`** (default: `["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]`)
  - File patterns to include when fixing workspace

- **`suitable.excludePatterns`** (default: `["node_modules/**", "build/**", "dist/**"]`)
  - File patterns to exclude when fixing workspace

### Configuration

- **`suitable.customConfigPath`** (default: `""`)
  - Path to custom ESLint configuration file
  - Leave empty to use auto-detected or default configuration

- **`suitable.focusAreas`** (default: `["unused-imports", "unused-vars", "formatting"]`)
  - Focus on specific types of issues
  - Options: `unused-imports`, `unused-vars`, `formatting`, `react-hooks`, `typescript`

## What Gets Fixed

### Unused Code Removal
- **Unused imports** - Automatically removes unused import statements
- **Unused variables** - Removes unused variables and function parameters

### React-Specific Issues
- **React imports** - Removes unnecessary React imports (React 17+)
- **React Hooks rules** - Fixes React Hooks violations
- **JSX variables** - Ensures JSX variables are marked as used

### Code Formatting
- **Trailing spaces** - Removes trailing whitespace
- **Semicolons** - Adds missing semicolons
- **Quotes** - Standardizes quote usage
- **Indentation** - Fixes indentation issues
- **Object/Array spacing** - Standardizes spacing

### TypeScript Issues
- **Type annotations** - Fixes various TypeScript linting issues
- **Import/export** - Optimizes TypeScript imports

## Requirements

- **Node.js** 14.0.0 or higher
- **Suitable CLI** - The extension will try to use `npx suitable` if not globally installed

## Installation Methods

### Option 1: Global Suitable Installation (Recommended)
```bash
npm install -g suitable
```

### Option 2: Project-local Installation
```bash
npm install --save-dev suitable
```

### Option 3: Use with npx (No Installation)
The extension will automatically use `npx suitable` if Suitable is not globally installed.

## Usage Examples

### Basic Usage
1. Open a React project with some unused imports
2. Press `Ctrl+Shift+Alt+F` to fix the current file
3. See the issues get fixed automatically!

### Workspace-wide Fixing
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Suitable: Fix Workspace"
3. Watch as all files get processed

### Interactive Configuration
1. Run "Suitable: Fix Workspace (Interactive)"
2. Choose your configuration type (Default, React, Next.js)
3. Select focus areas (unused imports, formatting, etc.)
4. Review and execute

### Preview Changes First
1. Run "Suitable: Dry Run (Preview Changes)"
2. Check the Output panel for a list of issues found
3. Run the actual fix if you're happy with the results

## Output Panel

The extension provides detailed output in the "Suitable" output panel:

- **Execution logs** - See exactly what commands are being run
- **Fix results** - Detailed information about what was fixed
- **Error messages** - Helpful error information if something goes wrong

Access it via: `View` → `Output` → Select "Suitable" from the dropdown

## Configuration Examples

### Auto-fix on Save
```json
{
  "suitable.autoFixOnSave": true,
  "suitable.enableNotifications": false
}
```

### Custom File Patterns
```json
{
  "suitable.includePatterns": ["src/**/*.tsx", "components/**/*.ts"],
  "suitable.excludePatterns": ["**/*.test.ts", "**/*.stories.tsx"]
}
```

### Focus on Specific Issues
```json
{
  "suitable.focusAreas": ["unused-imports", "react-hooks"]
}
```

### Use Custom ESLint Config
```json
{
  "suitable.customConfigPath": "./.eslintrc.custom.js"
}
```

## Troubleshooting

### "Suitable command not found"
- Install Suitable globally: `npm install -g suitable`
- Or ensure it's in your project: `npm install --save-dev suitable`
- The extension will try `npx suitable` as a fallback

### "No workspace folder found"
- Open a folder or workspace in VS Code
- The extension needs a workspace context to operate

### Extension not working with certain files
- Ensure the file has a supported extension: `.js`, `.jsx`, `.ts`, `.tsx`
- Check that the file is in a supported language mode

### Auto-fix on save not working
- Ensure `suitable.autoFixOnSave` is set to `true`
- Make sure the file is saved (not just auto-saved)
- Check the Output panel for any error messages

## Contributing

This extension is part of the Suitable project. Contributions are welcome!

- **Report bugs**: [GitHub Issues](https://github.com/sh20raj/react-suitable/issues)
- **Feature requests**: [GitHub Issues](https://github.com/sh20raj/react-suitable/issues)
- **Source code**: [GitHub Repository](https://github.com/sh20raj/react-suitable)

## License

MIT License - see [LICENSE](https://github.com/sh20raj/react-suitable/blob/main/LICENSE) for details.

---

**Made with ❤️ for the React community**