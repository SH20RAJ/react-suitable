import * as vscode from 'vscode';
import { SuitableExtension } from './suitableExtension';

export function activate(context: vscode.ExtensionContext) {
    console.log('Suitable extension is now active!');
    
    const suitableExtension = new SuitableExtension(context);
    
    // Register commands
    const commands = [
        vscode.commands.registerCommand('suitable.fixCurrentFile', () => 
            suitableExtension.fixCurrentFile()
        ),
        vscode.commands.registerCommand('suitable.fixWorkspace', () => 
            suitableExtension.fixWorkspace()
        ),
        vscode.commands.registerCommand('suitable.fixWorkspaceInteractive', () => 
            suitableExtension.fixWorkspaceInteractive()
        ),
        vscode.commands.registerCommand('suitable.dryRun', () => 
            suitableExtension.dryRun()
        ),
        vscode.commands.registerCommand('suitable.openSettings', () => 
            suitableExtension.openSettings()
        )
    ];
    
    // Register event listeners
    if (suitableExtension.getConfig().get<boolean>('autoFixOnSave')) {
        const onSaveListener = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
            if (suitableExtension.isSupported(document)) {
                suitableExtension.fixDocument(document);
            }
        });
        context.subscriptions.push(onSaveListener);
    }
    
    // Add all commands to subscriptions
    context.subscriptions.push(...commands);
    
    // Show welcome message on first install
    if (context.globalState.get('suitable.firstInstall', true)) {
        context.globalState.update('suitable.firstInstall', false);
        suitableExtension.showWelcomeMessage();
    }
}

export function deactivate() {
    console.log('Suitable extension is now inactive');
}