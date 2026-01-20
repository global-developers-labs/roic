import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export async function setupAction() {
  console.log(chalk.green('\n🛠️  Initializing ROC IO Setup...'));

  const files = await glob('**/*', { 
    ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '*.png', '*.jpg', '*.svg', '*.ico'],
    nodir: true 
  });

  if (files.length === 0) {
    console.log(chalk.yellow('⚠️  No source files found in the current directory.'));
  }

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedFiles',
      message: 'Select the files/folders you want ROC IO bots to analyze:',
      choices: files.slice(0, 20).concat(files.length > 20 ? ['...and more'] : []),
      validate: (answer) => {
        if (answer.length < 1) {
          return 'You must choose at least one file.';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'confirmSetup',
      message: 'Do you want to save this configuration?',
      default: true
    }
  ]);

  if (answers.confirmSetup) {
    const config = {
      project: path.basename(process.cwd()),
      analyzedFiles: answers.selectedFiles,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    await fs.writeJson('.roc-io-config.json', config, { spaces: 2 });
    console.log(chalk.green('\n✅ Setup complete! Configuration saved to .roc-io-config.json'));
    console.log(chalk.cyan('You can now run "rock-io run" to start the analysis.'));
  } else {
    console.log(chalk.red('\n❌ Setup cancelled.'));
  }
}
