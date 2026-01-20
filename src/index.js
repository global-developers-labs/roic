#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { setupAction } from './commands/setup.js';
import { runBotsAction, runByIdAction } from './commands/run.js';

const program = new Command();

program
  .name('rock-io')
  .description('ROC IO - Deep-Deep Hyper Edition')
  .version('5.0.0');

program
  .command('setup')
  .action(setupAction);

program
  .command('run-boots')
  .action(runBotsAction);

program
  .command('run-boot <id>')
  .description('Retrieve scan results by Scan ID')
  .action(runByIdAction);

program.parse(process.argv);
