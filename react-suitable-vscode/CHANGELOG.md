# Change Log

All notable changes to the "Suitable VS Code Extension" will be documented in this file.

## [1.0.0] - 2024-01-XX

### Initial Release

#### Added
- **Fix Current File** command with keyboard shortcut (`Ctrl+Shift+Alt+F`)
- **Fix Workspace** command for processing entire workspace
- **Interactive Mode** with guided configuration options
- **Dry Run** functionality to preview changes before applying
- **Auto-fix on Save** option (disabled by default)
- Context menu integration for supported files
- Comprehensive settings configuration
- Output panel for detailed logging and results
- Support for JavaScript, TypeScript, JSX, and TSX files
- Integration with Suitable CLI tool

#### Features
- Automatic unused import removal
- Unused variable elimination
- React-specific optimizations
- Code formatting fixes
- TypeScript issue resolution
- Progress notifications and detailed output
- Configurable file patterns (include/exclude)
- Custom ESLint configuration support
- Focus areas selection (unused-imports, formatting, etc.)

#### Commands
- `suitable.fixCurrentFile` - Fix issues in the active file
- `suitable.fixWorkspace` - Fix issues across the workspace
- `suitable.fixWorkspaceInteractive` - Interactive configuration and fixing
- `suitable.dryRun` - Preview changes without applying them
- `suitable.openSettings` - Quick access to extension settings

#### Settings
- `suitable.autoFixOnSave` - Enable/disable auto-fix on file save
- `suitable.enableNotifications` - Control notification display
- `suitable.customConfigPath` - Path to custom ESLint config
- `suitable.includePatterns` - File patterns to include
- `suitable.excludePatterns` - File patterns to exclude
- `suitable.focusAreas` - Specific issue types to focus on

#### Requirements
- Node.js 14.0.0 or higher
- Suitable CLI (installed globally, locally, or via npx)
- VS Code 1.74.0 or higher