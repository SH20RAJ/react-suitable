import * as vscode from 'vscode';
import * as path from 'path';
import { SuitableRunner } from './suitableRunner';
import { OutputManager } from './outputManager';
import { ConfigManager } from './configManager';

export class SuitableExtension {
    private runner: SuitableRunner;
    private outputManager: OutputManager;
    private configManager: ConfigManager;
    
    constructor(private context: vscode.ExtensionContext) {
        this.outputManager = new OutputManager();
        this.configManager = new ConfigManager();
        this.runner = new SuitableRunner(this.outputManager, this.configManager);
    }
    
    getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('suitable');
    }
    
    isSupported(document: vscode.TextDocument): boolean {
        const supportedLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
        return supportedLanguages.includes(document.languageId);
    }
    
    async fixCurrentFile(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        
        if (!activeEditor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }
        
        if (!this.isSupported(activeEditor.document)) {
            vscode.window.showWarningMessage('Suitable only works with JavaScript/TypeScript files');
            return;
        }
        
        await this.fixDocument(activeEditor.document);
    }
    
    async fixDocument(document: vscode.TextDocument): Promise<void> {
        const filePath = document.fileName;
        
        try {
            await document.save(); // Ensure file is saved before processing
            
            const result = await this.runner.fixFile(filePath);
            
            if (this.getConfig().get<boolean>('enableNotifications', true)) {
                if (result.success) {
                    vscode.window.showInformationMessage(
                        `Suitable: Fixed ${result.issuesFixed} issues in ${path.basename(filePath)}`
                    );
                } else {
                    vscode.window.showErrorMessage(`Suitable: ${result.error}`);
                }
            }
            
            // Refresh the document in the editor
            if (result.success) {
                const workspaceEdit = new vscode.WorkspaceEdit();
                const fileUri = vscode.Uri.file(filePath);
                
                // Trigger a refresh by touching the file (VS Code will reload it)
                setTimeout(() => {
                    vscode.commands.executeCommand('workbench.action.files.revert', fileUri);
                }, 100);
            }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`Suitable: ${errorMessage}`);
            this.outputManager.appendError(`Error fixing file ${filePath}: ${errorMessage}`);
        }
    }
    
    async fixWorkspace(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage('No workspace folder found');
            return;
        }
        
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Suitable: Fixing workspace issues...',
            cancellable: true
        }, async (progress: vscode.Progress<{message?: string; increment?: number}>, token: vscode.CancellationToken) => {
            try {
                const result = await this.runner.fixWorkspace(workspaceRoot, {
                    onProgress: (message: string) => {
                        progress.report({ message });
                    }
                });
                
                if (result.success) {
                    vscode.window.showInformationMessage(
                        `Suitable: Fixed ${result.issuesFixed} issues in ${result.filesProcessed} files`
                    );
                } else {
                    vscode.window.showErrorMessage(`Suitable: ${result.error}`);
                }
                
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                vscode.window.showErrorMessage(`Suitable: ${errorMessage}`);
            }
        });
    }
    
    async fixWorkspaceInteractive(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage('No workspace folder found');
            return;
        }
        
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        // Show configuration options
        const options = await this.showInteractiveOptions();
        if (!options) {
            return; // User cancelled
        }
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Suitable: Running interactive fix...',
            cancellable: true
        }, async (progress: vscode.Progress<{message?: string; increment?: number}>) => {
            try {
                const result = await this.runner.fixWorkspaceInteractive(workspaceRoot, options, {
                    onProgress: (message: string) => {
                        progress.report({ message });
                    }
                });
                
                if (result.success) {
                    vscode.window.showInformationMessage(
                        `Suitable: Fixed ${result.issuesFixed} issues in ${result.filesProcessed} files`
                    );
                } else {
                    vscode.window.showErrorMessage(`Suitable: ${result.error}`);
                }
                
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                vscode.window.showErrorMessage(`Suitable: ${errorMessage}`);
            }
        });
    }
    
    async dryRun(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage('No workspace folder found');
            return;
        }
        
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Suitable: Analyzing issues...',
            cancellable: true
        }, async (progress: vscode.Progress<{message?: string; increment?: number}>) => {
            try {
                const result = await this.runner.dryRun(workspaceRoot, {
                    onProgress: (message: string) => {
                        progress.report({ message });
                    }
                });
                
                if (result.success) {
                    // Show results in output channel and a summary notification
                    this.outputManager.show();
                    vscode.window.showInformationMessage(
                        `Suitable: Found ${result.issuesFound} issues in ${result.filesProcessed} files. Check output for details.`
                    );
                } else {
                    vscode.window.showErrorMessage(`Suitable: ${result.error}`);
                }
                
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                vscode.window.showErrorMessage(`Suitable: ${errorMessage}`);
            }
        });
    }
    
    async openSettings(): Promise<void> {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'suitable');
    }
    
    private async showInteractiveOptions(): Promise<any> {
        const focusAreas = await vscode.window.showQuickPick([
            { label: 'Unused Imports', value: 'unused-imports', picked: true },
            { label: 'Unused Variables', value: 'unused-vars', picked: true },
            { label: 'Code Formatting', value: 'formatting', picked: true },
            { label: 'React Hooks', value: 'react-hooks', picked: true },
            { label: 'TypeScript Issues', value: 'typescript', picked: true }
        ], {
            canPickMany: true,
            title: 'Select focus areas for fixing'
        });
        
        if (!focusAreas || focusAreas.length === 0) {
            return null;
        }
        
        const configType = await vscode.window.showQuickPick([
            { label: 'Default (JavaScript/TypeScript with React)', value: 'default' },
            { label: 'React (Optimized for React projects)', value: 'react' },
            { label: 'Next.js (Includes Next.js specific rules)', value: 'nextjs' },
            { label: 'Custom (Use existing configuration)', value: 'custom' }
        ], {
            title: 'Select configuration type'
        });
        
        if (!configType) {
            return null;
        }
        
        return {
            focusAreas: focusAreas.map((area: any) => area.value),
            configType: configType.value
        };
    }
    
    showWelcomeMessage(): void {
        const message = 'Welcome to Suitable! Use Ctrl+Shift+Alt+F to fix the current file or run commands from the Command Palette.';
        
        vscode.window.showInformationMessage(message, 'Open Settings', 'Show Commands')
            .then((selection: string | undefined) => {
                switch (selection) {
                    case 'Open Settings':
                        this.openSettings();
                        break;
                    case 'Show Commands':
                        vscode.commands.executeCommand('workbench.action.showCommands', 'Suitable:');
                        break;
                }
            });
    }
}