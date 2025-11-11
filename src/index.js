const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const glob = require('glob');
const { createDefaultConfig } = require('./config');


class Suitable {
  constructor(projectPath, options = {}) {
    this.projectPath = path.resolve(projectPath);
    this.options = options;
    this.eslint = null;
    this.stats = {
      filesProcessed: 0,
      issuesFixed: 0,
      unusedImportsRemoved: 0,
      unusedVarsRemoved: 0
    };
  }

  async initialize() {
    const spinner = ora('Initializing ESLint configuration...').start();
    
    try {
      // Check if project has existing ESLint config
      const configPath = this.findExistingConfig() || await this.createConfig();
      
      // Initialize ESLint with our configuration
      this.eslint = new ESLint({
        baseConfig: this.options.config ? require(path.resolve(this.options.config)) : createDefaultConfig(),
        fix: this.options.fix !== false,
        useEslintrc: !!this.findExistingConfig(),
        cwd: this.projectPath
      });

      spinner.succeed('ESLint configuration ready');
      return true;
    } catch (error) {
      spinner.fail(`Failed to initialize: ${error.message}`);
      throw error;
    }
  }

  findExistingConfig() {
    const configFiles = [
      '.eslintrc.js',
      '.eslintrc.json',
      '.eslintrc.yml',
      '.eslintrc.yaml',
      'eslint.config.js'
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(this.projectPath, configFile);
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }

    // Check package.json for eslintConfig
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.eslintConfig) {
        return packageJsonPath;
      }
    }

    return null;
  }

  async createConfig() {
    const configPath = path.join(this.projectPath, '.eslintrc.js');
    if (!fs.existsSync(configPath)) {
      console.log(chalk.yellow('No ESLint config found. Creating default configuration...'));
      fs.writeFileSync(configPath, this.generateConfigFile());
      console.log(chalk.green(`Created ${configPath}`));
    }
    return configPath;
  }

  generateConfigFile() {
    return `module.exports = ${JSON.stringify(createDefaultConfig(), null, 2)};`;
  }

  async getFilesToProcess() {
    const includePatterns = this.options.include ? this.options.include.split(',').map(p => p.trim()) : ['**/*.{js,jsx,ts,tsx}'];
    const excludePatterns = this.options.exclude ? this.options.exclude.split(',').map(p => p.trim()) : ['node_modules/**', 'build/**', 'dist/**'];

    let files = [];
    
    for (const pattern of includePatterns) {
      const patternFiles = glob.sync(pattern, {
        cwd: this.projectPath,
        ignore: excludePatterns,
        absolute: true
      });
      files = files.concat(patternFiles);
    }

    // Remove duplicates
    return [...new Set(files)];
  }

  async processFiles() {
    const files = await this.getFilesToProcess();
    
    if (files.length === 0) {
      console.log(chalk.yellow('No files found to process.'));
      return;
    }

    const spinner = ora(`Processing ${files.length} files...`).start();

    try {
      const results = await this.eslint.lintFiles(files);
      
      this.stats.filesProcessed = results.length;

      // Count issues before fixing
      const totalIssues = results.reduce((sum, result) => sum + result.messages.length, 0);

      if (this.options.dryRun) {
        spinner.succeed(`Dry run complete: Found ${totalIssues} issues in ${results.length} files`);
        this.displayResults(results, true);
        return;
      }

      // Apply fixes
      if (this.options.fix !== false) {
        await ESLint.outputFixes(results);
        this.countFixedIssues(results);
      }

      spinner.succeed(`Processing complete: ${this.stats.issuesFixed} issues fixed in ${results.length} files`);
      this.displaySummary();
      
    } catch (error) {
      spinner.fail(`Processing failed: ${error.message}`);
      throw error;
    }
  }

  countFixedIssues(results) {
    results.forEach(result => {
      result.messages.forEach(message => {
        if (message.fix) {
          this.stats.issuesFixed++;
          
          // Count specific types of fixes
          if (message.ruleId === 'unused-imports/no-unused-imports') {
            this.stats.unusedImportsRemoved++;
          } else if (message.ruleId === '@typescript-eslint/no-unused-vars' || message.ruleId === 'no-unused-vars') {
            this.stats.unusedVarsRemoved++;
          }
        }
      });
    });
  }

  displayResults(results, isDryRun = false) {
    console.log('\n' + chalk.bold(isDryRun ? 'Issues Found (Dry Run):' : 'Issues Fixed:'));
    
    results.forEach(result => {
      if (result.messages.length > 0) {
        console.log(`\n${chalk.cyan(path.relative(this.projectPath, result.filePath))}:`);
        
        result.messages.forEach(message => {
          const severity = message.severity === 2 ? chalk.red('error') : chalk.yellow('warning');
          console.log(`  ${message.line}:${message.column} ${severity} ${message.message} ${chalk.gray(message.ruleId || '')}`);
        });
      }
    });
  }

  displaySummary() {
    console.log('\n' + chalk.bold.green('✨ Summary:'));
    console.log(`${chalk.green('Files processed:')} ${this.stats.filesProcessed}`);
    console.log(`${chalk.green('Issues fixed:')} ${this.stats.issuesFixed}`);
    console.log(`${chalk.green('Unused imports removed:')} ${this.stats.unusedImportsRemoved}`);
    console.log(`${chalk.green('Unused variables removed:')} ${this.stats.unusedVarsRemoved}`);
  }
}

async function runSuitable(projectPath = '.', options = {}) {
  try {
    if (options.interactive) {
      const { InteractiveMode } = require('./interactive');
      const interactive = new InteractiveMode(projectPath);
      return await interactive.run();
    }

    const suitable = new Suitable(projectPath, options);
    await suitable.initialize();
    await suitable.processFiles();
    
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    throw error;
  }
}

module.exports = { 
  runSuitable,
  Suitable
};