# Suitable VS Code Extension - Development Guide

## Overview

This is the official VS Code extension for **Suitable**, the React ESLint auto-fixer CLI tool. This extension brings the power of Suitable directly into your VS Code editor.

## Project Structure

```
react-suitable-vscode/
├── src/                    # TypeScript source files
│   ├── extension.ts        # Main extension entry point
│   ├── suitableExtension.ts # Core extension logic
│   ├── suitableRunner.ts   # CLI integration and execution
│   ├── outputManager.ts    # Output panel management
│   └── configManager.ts    # Configuration management
├── out/                    # Compiled JavaScript (generated)
├── images/                 # Extension icons and assets
├── scripts/               # Build and packaging scripts
├── package.json           # Extension manifest and dependencies
├── tsconfig.json          # TypeScript configuration
├── README.md              # User documentation
└── CHANGELOG.md           # Version history
```

## Features Implemented

### Core Commands
- **Fix Current File** (`suitable.fixCurrentFile`) - Fix the currently active file
- **Fix Workspace** (`suitable.fixWorkspace`) - Fix all supported files in workspace
- **Interactive Mode** (`suitable.fixWorkspaceInteractive`) - Guided configuration
- **Dry Run** (`suitable.dryRun`) - Preview changes without applying
- **Open Settings** (`suitable.openSettings`) - Quick access to settings

### UI Integration
- **Context Menus** - Right-click options for supported files
- **Command Palette** - All commands accessible via Ctrl+Shift+P
- **Keyboard Shortcuts** 
  - `Ctrl+Shift+Alt+F` (Mac: `Cmd+Shift+Alt+F`) - Fix current file
  - `Ctrl+Shift+Alt+W` (Mac: `Cmd+Shift+Alt+W`) - Fix workspace
- **Progress Notifications** - Real-time feedback during operations
- **Output Panel** - Detailed logging in "Suitable" output channel

### Configuration Options
- **Auto-fix on Save** - Automatically fix issues when files are saved
- **Notification Control** - Enable/disable result notifications  
- **File Patterns** - Configure include/exclude patterns
- **Custom Config** - Path to custom ESLint configuration
- **Focus Areas** - Choose specific issue types to focus on

## Development Setup

### Prerequisites
- Node.js 14.0.0 or higher
- VS Code 1.74.0 or higher
- TypeScript 5.1.6 or higher

### Installation

1. **Clone and navigate to extension directory:**
```bash
cd /path/to/suitable/react-suitable-vscode
```

2. **Install dependencies:**
```bash
npm install
```

3. **Compile TypeScript:**
```bash
npm run compile
```

### Development Workflow

1. **Open in VS Code:**
```bash
code .
```

2. **Run Extension in Development:**
   - Press `F5` to open Extension Development Host
   - Or use `Run > Start Debugging`

3. **Make Changes:**
   - Edit TypeScript files in `src/`
   - Recompile: `npm run compile`
   - Reload extension: `Ctrl+Shift+P` > "Developer: Reload Window"

4. **Watch Mode (Optional):**
```bash
npm run watch
```

### Testing

1. **Manual Testing:**
   - Use F5 to launch Extension Development Host
   - Open a React project
   - Test commands via Command Palette or shortcuts

2. **Test Scenarios:**
   - Files with unused imports
   - Files with unused variables
   - Different project types (React, Next.js, TypeScript)
   - Error handling (no Suitable CLI, invalid files, etc.)

## Architecture

### Extension Lifecycle
1. **Activation** - Extension activates on JS/TS file open
2. **Command Registration** - All commands registered with VS Code
3. **Event Listeners** - File save listeners for auto-fix
4. **CLI Integration** - Spawns Suitable CLI processes
5. **Result Processing** - Parses output and updates UI

### Key Components

#### SuitableExtension Class
- Main orchestrator for extension functionality
- Handles VS Code UI interactions
- Manages command execution flow
- Provides user feedback and error handling

#### SuitableRunner Class
- Manages CLI process execution
- Handles different operation modes (fix, dry-run, interactive)
- Parses CLI output for statistics
- Provides progress callbacks

#### ConfigManager Class
- Reads VS Code settings
- Translates settings to CLI arguments
- Handles configuration validation

#### OutputManager Class
- Manages the "Suitable" output channel
- Provides structured logging
- Formats messages with timestamps

## CLI Integration

The extension integrates with the Suitable CLI in the following ways:

### Process Execution
- Uses Node.js `spawn` to run CLI commands
- Supports both `suitable` (global) and `npx suitable` (local/npx)
- Captures stdout/stderr for processing
- Provides real-time output streaming

### Command Translation
- VS Code settings → CLI arguments
- Interactive options → CLI parameters
- File paths → relative path arguments

### Output Parsing
- Extracts statistics (files processed, issues fixed)
- Identifies error conditions
- Provides structured feedback to users

## Configuration Schema

### User Settings
```json
{
  "suitable.autoFixOnSave": false,
  "suitable.enableNotifications": true,
  "suitable.customConfigPath": "",
  "suitable.includePatterns": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  "suitable.excludePatterns": ["node_modules/**", "build/**", "dist/**"],
  "suitable.focusAreas": ["unused-imports", "unused-vars", "formatting"]
}
```

### Command Contributions
- Commands defined in `package.json` contributes.commands
- Menus and keybindings configured in contributes section
- Activation events for supported file types

## Building and Packaging

### Compile for Distribution
```bash
npm run compile
```

### Package Extension (Future)
```bash
# Install vsce if not available
npm install -g @vscode/vsce

# Package extension
vsce package
```

### Installation (Future)
```bash
code --install-extension suitable-vscode-1.0.0.vsix
```

## Troubleshooting

### Common Issues

1. **"Suitable command not found"**
   - Ensure Suitable CLI is installed: `npm install -g suitable`
   - Check PATH includes npm global bin directory

2. **TypeScript compilation errors**
   - Ensure @types/vscode is installed: `npm install @types/vscode`
   - Check TypeScript version compatibility

3. **Extension not activating**
   - Check activation events in package.json
   - Verify supported file types are open

### Debug Mode

1. **Enable Extension Debug:**
   - F5 to launch Extension Development Host
   - Check Debug Console for logs

2. **CLI Debug:**
   - Check "Suitable" output panel for CLI execution logs
   - Verify CLI arguments being passed

## Future Enhancements

### Planned Features
- **Status Bar Integration** - Show Suitable status and quick actions
- **Problem Panel Integration** - Show issues in VS Code Problems panel
- **Configuration Wizard** - First-run setup assistant
- **Workspace Settings** - Project-specific configuration support
- **Diff Preview** - Show changes before applying fixes

### Possible Improvements
- **Performance Optimization** - Batch operations, smart file watching
- **Better Error Handling** - More specific error messages and recovery
- **Advanced Configuration** - Rule-level configuration UI
- **Integration with ESLint Extension** - Avoid conflicts, complement functionality

## Contributing

1. **Code Style**: Follow existing TypeScript patterns
2. **Error Handling**: Always provide user-friendly error messages  
3. **User Experience**: Prioritize clear feedback and non-intrusive operation
4. **Testing**: Test with various project types and edge cases

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Suitable CLI Documentation](../README.md)