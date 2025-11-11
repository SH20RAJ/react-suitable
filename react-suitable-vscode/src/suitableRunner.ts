import * as vscode from 'vscode';
import { spawn, SpawnOptions } from 'child_process';
import * as path from 'path';
import { OutputManager } from './outputManager';
import { ConfigManager } from './configManager';

export interface SuitableResult {
    success: boolean;
    issuesFixed?: number;
    filesProcessed?: number;
    issuesFound?: number;
    error?: string;
    output?: string;
}

export interface ProgressCallback {
    onProgress?: (message: string) => void;
}

export class SuitableRunner {
    constructor(
        private outputManager: OutputManager,
        private configManager: ConfigManager
    ) {}
    
    async fixFile(filePath: string): Promise<SuitableResult> {
        const workspaceRoot = this.getWorkspaceRoot(filePath);
        const relativePath = path.relative(workspaceRoot, filePath);
        
        this.outputManager.appendLine(`Fixing file: ${relativePath}`);
        
        const args = [
            '--fix',
            '--include', relativePath,
            ...this.configManager.getCommandArgs()
        ];
        
        return this.runSuitable(workspaceRoot, args);
    }
    
    async fixWorkspace(workspaceRoot: string, callbacks?: ProgressCallback): Promise<SuitableResult> {
        this.outputManager.appendLine('Fixing workspace issues...');
        
        const args = [
            '--fix',
            ...this.configManager.getCommandArgs()
        ];
        
        return this.runSuitable(workspaceRoot, args, callbacks);
    }
    
    async fixWorkspaceInteractive(
        workspaceRoot: string, 
        options: any, 
        callbacks?: ProgressCallback
    ): Promise<SuitableResult> {
        this.outputManager.appendLine('Running interactive fix...');
        
        // For now, we'll run with the selected options
        // In a future version, we could implement a more sophisticated interactive mode
        const args = [
            '--fix',
            ...this.configManager.getCommandArgs(options)
        ];
        
        return this.runSuitable(workspaceRoot, args, callbacks);
    }
    
    async dryRun(workspaceRoot: string, callbacks?: ProgressCallback): Promise<SuitableResult> {
        this.outputManager.appendLine('Analyzing issues (dry run)...');
        
        const args = [
            '--dry-run',
            ...this.configManager.getCommandArgs()
        ];
        
        return this.runSuitable(workspaceRoot, args, callbacks);
    }
    
    private async runSuitable(
        workspaceRoot: string, 
        args: string[], 
        callbacks?: ProgressCallback
    ): Promise<SuitableResult> {
        return new Promise((resolve, reject) => {
            const suitablePath = this.getSuitablePath();
            
            this.outputManager.appendLine(`Running: ${suitablePath} ${args.join(' ')}`);
            
            const options: SpawnOptions = {
                cwd: workspaceRoot,
                shell: true
            };
            
            const child = spawn(suitablePath, args, options);
            
            let stdout = '';
            let stderr = '';
            
            child.stdout?.on('data', (data) => {
                const output = data.toString();
                stdout += output;
                this.outputManager.append(output);
                
                // Try to extract progress information
                if (callbacks?.onProgress) {
                    const lines = output.split('\n');
                    for (const line of lines) {
                        if (line.includes('Processing') || line.includes('Fixed') || line.includes('files')) {
                            callbacks.onProgress(line.trim());
                        }
                    }
                }
            });
            
            child.stderr?.on('data', (data) => {
                const output = data.toString();
                stderr += output;
                this.outputManager.appendError(output);
            });
            
            child.on('close', (code) => {
                if (code === 0) {
                    const result = this.parseOutput(stdout);
                    this.outputManager.appendLine('✅ Suitable completed successfully');
                    resolve(result);
                } else {
                    const error = stderr || `Process exited with code ${code}`;
                    this.outputManager.appendError(`❌ Suitable failed: ${error}`);
                    resolve({
                        success: false,
                        error: error
                    });
                }
            });
            
            child.on('error', (error) => {
                this.outputManager.appendError(`❌ Failed to run Suitable: ${error.message}`);
                resolve({
                    success: false,
                    error: error.message
                });
            });
        });
    }
    
    private parseOutput(output: string): SuitableResult {
        const result: SuitableResult = { success: true };
        
        // Try to extract statistics from the output
        const issuesFixedMatch = output.match(/(\d+)\s+issues?\s+fixed/i);
        if (issuesFixedMatch) {
            result.issuesFixed = parseInt(issuesFixedMatch[1], 10);
        }
        
        const filesProcessedMatch = output.match(/(\d+)\s+files?\s+processed/i);
        if (filesProcessedMatch) {
            result.filesProcessed = parseInt(filesProcessedMatch[1], 10);
        }
        
        const issuesFoundMatch = output.match(/Found\s+(\d+)\s+issues?/i);
        if (issuesFoundMatch) {
            result.issuesFound = parseInt(issuesFoundMatch[1], 10);
        }
        
        result.output = output;
        
        return result;
    }
    
    private getSuitablePath(): string {
        // Try to find suitable in various locations
        const possiblePaths = [
            'suitable',  // Global installation
            'npx suitable',  // Via npx
            path.join(__dirname, '../../node_modules/.bin/suitable'),  // Local to extension
            path.join(process.cwd(), 'node_modules/.bin/suitable')  // Project local
        ];
        
        // For now, return the first option and let the system resolve it
        // In a future version, we could check which ones exist
        return 'npx suitable';
    }
    
    private getWorkspaceRoot(filePath?: string): string {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return filePath ? path.dirname(filePath) : process.cwd();
        }
        
        if (filePath && workspaceFolders.length > 1) {
            // Find the workspace folder that contains this file
            for (const folder of workspaceFolders) {
                if (filePath.startsWith(folder.uri.fsPath)) {
                    return folder.uri.fsPath;
                }
            }
        }
        
        return workspaceFolders[0].uri.fsPath;
    }
}