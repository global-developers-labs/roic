import chalk from 'chalk';
import fs from 'fs-extra';
import { analyzeFile, calculateRiskScore } from '../bots/analyzer.js';

export async function runBotsAction() {
  console.log(chalk.bold.cyan('\n🧠 ROC IO - DEEP HYPER BOT ACTIVATED'));
  console.log(chalk.gray('Performing 30x Deep Analysis with Auto-Fix Suggestions...\n'));

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
      const { issues, scanTime } = await analyzeFile(file, content, 'DEEP_HYPER');
      
      if (issues.length > 0) {
        console.log(chalk.bold.yellow(`\n🔍 [${scanTime}ms] ${file} (${issues.length} issues)`));
        
        issues.forEach(issue => {
          console.log(chalk.red(`   [${issue.type}] Line ${issue.line}: ${issue.message}`));
          console.log(chalk.gray(`      Original: `) + chalk.white(issue.original));
          console.log(chalk.green(`      Suggested Fix: `) + chalk.bold(issue.suggestedFix));
          console.log('');
        });
        allProjectIssues.push(...issues);
      } else {
        // console.log(chalk.green(`✨ [${scanTime}ms] ${file} -> CLEAN`));
      }
      totalFilesScanned++;
    } catch (err) {
      // Skip binary or unreadable files
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;
  const { probability, status } = calculateRiskScore(allProjectIssues);

  console.log(chalk.bold('\n' + '='.repeat(60)));
  console.log(chalk.bold.white(`📊 DEEP HYPER ANALYSIS SUMMARY`));
  console.log('='.repeat(60));
  console.log(`⏱️  Scan Duration: ${chalk.cyan(totalTime.toFixed(3) + 's')}`);
  console.log(`📂 Files Scanned: ${chalk.cyan(totalFilesScanned)}`);
  console.log(`⚠️  Total Issues: ${chalk.red(allProjectIssues.length)}`);
  
  console.log('\n' + '-'.repeat(40));
  console.log(chalk.bold(`🔥 FAILURE PROBABILITY: ${probability}%`));
  
  const statusColor = probability > 75 ? chalk.bgRed : (probability > 40 ? chalk.bgYellow : chalk.bgGreen);
  console.log(statusColor.black(` STATUS: ${status} `));
  console.log('-'.repeat(40));

  if (probability > 50) {
    console.log(chalk.red('\n🚨 ACTION REQUIRED: Apply the suggested fixes to stabilize the system.'));
  } else {
    console.log(chalk.green('\n✅ System health is optimal. Suggestions are for optimization.'));
  }
}
