#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { setupAction } from './commands/setup.js';
import { runBotsAction, runByIdAction, askPromptAction } from './commands/run.js';

const program = new Command();

program
  .name('rock-io')
  .description('ROC IO - Deep-Deep Hyper Edition (AI Prompt Enabled)')
  .version('6.0.0');

program
  .command('setup')
  .description('Setup project and select files')
  .action(setupAction);

program
  .command('run-boots')
  .description('Run deep pulse scan on all files')
  .action(runBotsAction);

program
  .command('run-boot <id>')
  .description('Retrieve scan results by Scan ID')
  .action(runByIdAction);

program
  .command('ask <prompt...>')
  .description('Ask ROC IO to perform specific analysis using natural language')
  .action((prompt) => askPromptAction(prompt.join(' ')));

program.parse(process.argv);
