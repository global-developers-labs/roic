import chalk from 'chalk';
import fs from 'fs-extra';
import { analyzeFile } from '../bots/analyzer.js';

export async function runBotsAction() {
  console.log(chalk.magenta('\n🤖 ROC IO Bots are starting the analysis...'));

  if (!await fs.pathExists('.roc-io-config.json')) {
    console.log(chalk.red('❌ Error: Project not configured. Please run "rock-io setup" first.'));
    return;
  }

  const config = await fs.readJson('.roc-io-config.json');
  const files = config.analyzedFiles;

  console.log(chalk.blue(`\n🔍 Analyzing ${files.length} files...\n`));

  let totalBugs = 0;

  for (const file of files) {
    process.stdout.write(chalk.gray(`Checking ${file}... `));
    
    try {
      const content = await fs.readFile(file, 'utf8');
      const results = await analyzeFile(file, content);
      
      if (results.length > 0) {
        console.log(chalk.yellow('⚠️  Potential Issues Found'));
        results.forEach(bug => {
          console.log(chalk.red(`   - [${bug.type}] ${bug.message}`));
          totalBugs++;
        });
      } else {
        console.log(chalk.green('✅ Clean'));
      }
    } catch (err) {
      console.log(chalk.red('❌ Error reading file'));
    }
  }

  console.log(chalk.bold('\n--- Analysis Summary ---'));
  if (totalBugs > 0) {
    console.log(chalk.yellow(`Found ${totalBugs} potential issues across your project.`));
    console.log(chalk.cyan('Check the suggestions above to improve your code.'));
  } else {
    console.log(chalk.green('✨ Your project looks clean! No major bugs detected by ROC IO bots.'));
  }
}
