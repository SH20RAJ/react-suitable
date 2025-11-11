#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { runSuitable } = require('../src/index');

program
  .name('suitable')
  .description('Automatically fix common ESLint issues in React projects')
  .version('1.0.0')
  .argument('[path]', 'Path to project directory', '.')
  .option('-f, --fix', 'Automatically fix issues', true)
  .option('-i, --interactive', 'Run in interactive mode')
  .option('--dry-run', 'Show what would be fixed without making changes')
  .option('--config <path>', 'Custom ESLint config file path')
  .option('--include <patterns>', 'Include file patterns (comma-separated)', '**/*.js,**/*.jsx,**/*.ts,**/*.tsx')
  .option('--exclude <patterns>', 'Exclude file patterns (comma-separated)', 'node_modules/**,build/**,dist/**')
  .action(async (path, options) => {
    try {
      console.log(chalk.blue.bold('🔧 Suitable - React ESLint Auto-fixer'));
      console.log(chalk.gray('Fixing common linting issues in your React project...\n'));
      
      await runSuitable(path, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();