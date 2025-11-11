const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { Suitable } = require('./index');
const { createDefaultConfig, createReactConfig, createNextJsConfig } = require('./config');

class InteractiveMode {
  constructor(projectPath) {
    this.projectPath = projectPath;
  }

  async run() {
    console.log(chalk.blue.bold('\n🔧 Suitable Interactive Mode\n'));
    console.log(chalk.gray('Let\'s configure your React project auto-fixer!\n'));

    try {
      // Step 1: Project type detection and configuration
      const projectType = await this.detectProjectType();
      const config = await this.selectConfiguration(projectType);
      
      // Step 2: File selection options
      const fileOptions = await this.configureFileOptions();
      
      // Step 3: Fix options
      const fixOptions = await this.configurefixOptions();
      
      // Step 4: Confirmation and execution
      await this.confirmAndExecute({
        ...config,
        ...fileOptions,
        ...fixOptions
      });

    } catch (error) {
      console.error(chalk.red('Interactive mode failed:'), error.message);
      throw error;
    }
  }

  async detectProjectType() {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    let detectedType = 'react';

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps.next) {
        detectedType = 'nextjs';
      } else if (deps.react) {
        detectedType = 'react';
      } else if (deps['@types/react'] || deps.typescript) {
        detectedType = 'typescript';
      }
    }

    console.log(chalk.green(`Detected project type: ${detectedType}`));
    return detectedType;
  }

  async selectConfiguration(detectedType) {
    const { configType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'configType',
        message: 'Select ESLint configuration:',
        choices: [
          {
            name: 'Default (JavaScript/TypeScript with React)',
            value: 'default'
          },
          {
            name: 'React (Optimized for React projects)',
            value: 'react'
          },
          {
            name: 'Next.js (Includes Next.js specific rules)',
            value: 'nextjs'
          },
          {
            name: 'Custom (Use existing configuration)',
            value: 'custom'
          }
        ],
        default: detectedType === 'nextjs' ? 'nextjs' : detectedType === 'react' ? 'react' : 'default'
      }
    ]);

    let customConfigPath = null;
    if (configType === 'custom') {
      const { configPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'configPath',
          message: 'Enter path to your ESLint config file:',
          validate: (input) => {
            if (fs.existsSync(path.resolve(input))) {
              return true;
            }
            return 'File does not exist. Please enter a valid path.';
          }
        }
      ]);
      customConfigPath = configPath;
    }

    return { configType, customConfigPath };
  }

  async configureFileOptions() {
    const { filePatterns } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'filePatterns',
        message: 'Select file types to process:',
        choices: [
          { name: 'JavaScript (.js)', value: '**/*.js', checked: true },
          { name: 'JSX (.jsx)', value: '**/*.jsx', checked: true },
          { name: 'TypeScript (.ts)', value: '**/*.ts', checked: true },
          { name: 'TSX (.tsx)', value: '**/*.tsx', checked: true },
          { name: 'Vue (.vue)', value: '**/*.vue' },
          { name: 'Custom pattern', value: 'custom' }
        ]
      }
    ]);

    let customPattern = null;
    if (filePatterns.includes('custom')) {
      const { pattern } = await inquirer.prompt([
        {
          type: 'input',
          name: 'pattern',
          message: 'Enter custom file pattern (glob syntax):',
          default: '**/*.{js,jsx,ts,tsx}'
        }
      ]);
      customPattern = pattern;
    }

    const { excludePatterns } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'excludePatterns',
        message: 'Select directories to exclude:',
        choices: [
          { name: 'node_modules', value: 'node_modules/**', checked: true },
          { name: 'build/dist directories', value: '{build,dist}/**', checked: true },
          { name: 'Test files', value: '**/*.{test,spec}.{js,jsx,ts,tsx}' },
          { name: 'Stories (Storybook)', value: '**/*.stories.{js,jsx,ts,tsx}' },
          { name: '.next (Next.js)', value: '.next/**' }
        ]
      }
    ]);

    return {
      include: customPattern ? [customPattern] : filePatterns.filter(p => p !== 'custom'),
      exclude: excludePatterns
    };
  }

  async configurefixOptions() {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'autoFix',
        message: 'Automatically fix issues?',
        default: true
      },
      {
        type: 'confirm',
        name: 'dryRun',
        message: 'Perform dry run first (show what would be fixed)?',
        default: false
      },
      {
        type: 'checkbox',
        name: 'focusAreas',
        message: 'Focus on specific issue types:',
        choices: [
          { name: 'Unused imports', value: 'unused-imports', checked: true },
          { name: 'Unused variables', value: 'unused-vars', checked: true },
          { name: 'Code formatting', value: 'formatting', checked: true },
          { name: 'React hooks rules', value: 'react-hooks', checked: true },
          { name: 'TypeScript issues', value: 'typescript', checked: true }
        ]
      }
    ]);

    return answers;
  }

  async confirmAndExecute(options) {
    console.log(chalk.blue.bold('\n📋 Configuration Summary:'));
    console.log(`${chalk.cyan('Project path:')} ${this.projectPath}`);
    console.log(`${chalk.cyan('Configuration:')} ${options.configType}`);
    console.log(`${chalk.cyan('File patterns:')} ${options.include?.join(', ') || 'default'}`);
    console.log(`${chalk.cyan('Exclude patterns:')} ${options.exclude?.join(', ') || 'none'}`);
    console.log(`${chalk.cyan('Auto-fix:')} ${options.autoFix ? 'Yes' : 'No'}`);
    console.log(`${chalk.cyan('Dry run:')} ${options.dryRun ? 'Yes' : 'No'}`);
    console.log(`${chalk.cyan('Focus areas:')} ${options.focusAreas?.join(', ') || 'all'}`);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with this configuration?',
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled.'));
      return;
    }

    // Execute with the configured options
    const suitableOptions = {
      fix: options.autoFix,
      dryRun: options.dryRun,
      include: options.include?.join(','),
      exclude: options.exclude?.join(','),
      config: options.customConfigPath
    };

    if (options.configType !== 'custom') {
      // Create and use appropriate config
      const configMap = {
        default: createDefaultConfig(),
        react: createReactConfig(),
        nextjs: createNextJsConfig()
      };
      
      const configContent = configMap[options.configType];
      const tempConfigPath = path.join(this.projectPath, '.eslintrc.suitable.js');
      fs.writeFileSync(tempConfigPath, `module.exports = ${JSON.stringify(configContent, null, 2)};`);
      suitableOptions.config = tempConfigPath;
    }

    const suitable = new Suitable(this.projectPath, suitableOptions);
    await suitable.initialize();
    await suitable.processFiles();

    // Clean up temporary config if created
    const tempConfigPath = path.join(this.projectPath, '.eslintrc.suitable.js');
    if (fs.existsSync(tempConfigPath) && options.configType !== 'custom') {
      fs.unlinkSync(tempConfigPath);
    }

    console.log(chalk.green.bold('\n✅ Interactive session completed!'));
  }
}

module.exports = { InteractiveMode };