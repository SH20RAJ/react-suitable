import * as vscode from 'vscode';

export class ConfigManager {
    getCommandArgs(options?: any): string[] {
        const config = vscode.workspace.getConfiguration('suitable');
        const args: string[] = [];
        
        // Custom config path
        const customConfigPath = config.get<string>('customConfigPath');
        if (customConfigPath && customConfigPath.trim()) {
            args.push('--config', customConfigPath);
        }
        
        // Include patterns
        const includePatterns = config.get<string[]>('includePatterns');
        if (includePatterns && includePatterns.length > 0) {
            args.push('--include', includePatterns.join(','));
        }
        
        // Exclude patterns
        const excludePatterns = config.get<string[]>('excludePatterns');
        if (excludePatterns && excludePatterns.length > 0) {
            args.push('--exclude', excludePatterns.join(','));
        }
        
        // If options are provided from interactive mode, override some settings
        if (options) {
            if (options.configType && options.configType !== 'custom') {
                // Remove custom config if we're using a preset
                const configIndex = args.findIndex(arg => arg === '--config');
                if (configIndex >= 0) {
                    args.splice(configIndex, 2);
                }
                
                // Add config type (this would need to be handled by the CLI)
                args.push('--config-type', options.configType);
            }
            
            if (options.focusAreas && options.focusAreas.length > 0) {
                args.push('--focus-areas', options.focusAreas.join(','));
            }
        }
        
        return args;
    }
    
    getFocusAreas(): string[] {
        const config = vscode.workspace.getConfiguration('suitable');
        return config.get<string[]>('focusAreas', []);
    }
    
    isAutoFixOnSaveEnabled(): boolean {
        const config = vscode.workspace.getConfiguration('suitable');
        return config.get<boolean>('autoFixOnSave', false);
    }
    
    areNotificationsEnabled(): boolean {
        const config = vscode.workspace.getConfiguration('suitable');
        return config.get<boolean>('enableNotifications', true);
    }
}