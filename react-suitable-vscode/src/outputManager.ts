import * as vscode from 'vscode';

export class OutputManager {
    private outputChannel: vscode.OutputChannel;
    
    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Suitable');
    }
    
    appendLine(message: string): void {
        this.outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
    }
    
    append(message: string): void {
        this.outputChannel.append(message);
    }
    
    appendError(message: string): void {
        this.outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ❌ ${message}`);
    }
    
    show(): void {
        this.outputChannel.show();
    }
    
    clear(): void {
        this.outputChannel.clear();
    }
    
    dispose(): void {
        this.outputChannel.dispose();
    }
}