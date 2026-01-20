#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { setupAction } from './commands/setup.js';
import { runBotsAction } from './commands/run.js';

const program = new Command();

program
  .name('rock-io')
  .description('ROC IO - Smart Code Analysis CLI Tool')
  .version('1.0.0');

program
  .command('setup')
  .description('Setup ROC IO for your project')
  .action(setupAction);

program
  .command('run')
  .description('Run the analysis bots on your project')
  .option('-b, --bots', 'Run specifically the analysis bots')
  .action(async (options) => {
    if (options.bots || process.argv.includes('boots')) {
      await runBotsAction();
    } else {
      console.log(chalk.blue('\n🚀 Welcome to ROC IO Dashboard'));
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'Run Analysis Bots',
            'View Project Config',
            'Exit'
          ]
        }
      ]);

      if (answers.action === 'Run Analysis Bots') {
        await runBotsAction();
      } else {
        process.exit(0);
      }
    }
  });

// Support for "rock-io run boots" as requested
program
  .command('run-boots')
  .description('Alias for running analysis bots')
  .action(runBotsAction);

program.parse(process.argv);
