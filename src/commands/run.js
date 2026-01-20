import chalk from 'chalk';
import fs from 'fs-extra';
import { analyzeFile, calculateRiskScore } from '../bots/analyzer.js';

export async function runBotsAction() {
  console.log(chalk.bold.magenta('\n🚀 ROC IO - ULTRA FAST SPACE EDITION IS ACTIVE'));
  console.log(chalk.gray('Initializing Light-Speed Scan Engine...\n'));

  if (!await fs.pathExists('.roc-io-config.json')) {
    console.log(chalk.red('❌ Error: Project not configured. Run "rock-io setup" first.'));
    return;
  }

  const config = await fs.readJson('.roc-io-config.json');
  const files = config.analyzedFiles;
  const startTime = Date.now();

  let allProjectIssues = [];
  let totalFilesScanned = 0;

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const { issues, scanTime } = await analyzeFile(file, content);
      
      if (issues.length > 0) {
        console.log(chalk.yellow(`⚡ [${scanTime}ms] ${file} -> ${issues.length} issues found`));
        issues.forEach(issue => {
          const color = issue.severity > 30 ? chalk.red : chalk.cyan;
          console.log(color(`   [${issue.type}] ${issue.message}`));
        });
        allProjectIssues.push(...issues);
      } else {
        console.log(chalk.green(`✨ [${scanTime}ms] ${file} -> CLEAN`));
      }
      totalFilesScanned++;
    } catch (err) {
      // Skip binary or unreadable files silently for speed
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;
  const { probability, status } = calculateRiskScore(allProjectIssues);

  console.log(chalk.bold('\n' + '='.repeat(50)));
  console.log(chalk.bold.white(`📊 FINAL SPACE-SCAN REPORT`));
  console.log('='.repeat(50));
  console.log(`⏱️  Total Scan Time: ${chalk.cyan(totalTime.toFixed(3) + 's')}`);
  console.log(`📂 Files Processed: ${chalk.cyan(totalFilesScanned)}`);
  console.log(`⚠️  Total Issues: ${chalk.red(allProjectIssues.length)}`);
  
  console.log('\n' + '-'.repeat(30));
  console.log(chalk.bold(`🔥 SYSTEM FAILURE PROBABILITY: ${probability}%`));
  
  const statusColor = probability > 70 ? chalk.bgRed : (probability > 40 ? chalk.bgYellow : chalk.bgGreen);
  console.log(statusColor.black(` STATUS: ${status} `));
  console.log('-'.repeat(30));

  if (probability > 50) {
    console.log(chalk.red('\n🚨 WARNING: High probability of system leak or failure detected!'));
    console.log(chalk.red('Check the "Critical" issues above immediately.'));
  } else {
    console.log(chalk.green('\n✅ System appears robust. Keep maintaining best practices.'));
  }
}
