import chalk from 'chalk';
import fs from 'fs-extra';
import { analyzeFile, calculateRiskScore, saveScanResult, getScanResult } from '../bots/analyzer.js';

export async function runBotsAction() {
  console.log(chalk.bold.magenta('\n⚡ ROC IO - DEEP-DEEP HYPER PULSE SCAN'));
  
  if (!await fs.pathExists('.roc-io-config.json')) {
    console.log(chalk.red('❌ Config missing.'));
    return;
  }

  const config = await fs.readJson('.roc-io-config.json');
  const files = config.analyzedFiles;
  const startTime = Date.now();

  let allIssues = [];
  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const { issues } = await analyzeFile(file, content);
      allIssues.push(...issues);
    } catch (e) {}
  }

  const totalTime = (Date.now() - startTime) / 1000;
  const { probability, status } = calculateRiskScore(allIssues);
  
  const result = {
    timestamp: new Date().toISOString(),
    filesScanned: files.length,
    totalIssues: allIssues.length,
    scanTime: totalTime,
    probability,
    status
  };

  const scanId = await saveScanResult(result);

  console.log(chalk.green(`\n✅ Scan Complete in ${totalTime.toFixed(3)}s`));
  console.log(chalk.cyan(`📂 Files: ${files.length} | ⚠️ Issues: ${allIssues.length}`));
  console.log(chalk.bold.yellow(`\n🔑 SCAN ID: ${scanId}`));
  console.log(chalk.gray(`Use "rock-io run-boot ${scanId}" to retrieve this result anytime.`));
}

export async function runByIdAction(id) {
  const result = await getScanResult(id);
  if (!result) {
    console.log(chalk.red(`❌ No results found for ID: ${id}`));
    return;
  }

  console.log(chalk.bold.green(`\n📋 RETRIEVED SCAN DATA [ID: ${id}]`));
  console.log(chalk.white(`------------------------------------`));
  console.log(`📅 Date: ${result.timestamp}`);
  console.log(`📂 Files: ${result.filesScanned}`);
  console.log(`⚠️ Issues: ${result.totalIssues}`);
  console.log(`⏱️ Time: ${result.scanTime.toFixed(3)}s`);
  console.log(`🔥 Risk: ${result.probability}% [${result.status}]`);
}
