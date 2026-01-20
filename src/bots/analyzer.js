/**
 * ROC IO Advanced Code Analyzer Bot
 * Enhanced version with deeper scanning and more precise bug detection.
 */

export async function analyzeFile(filename, content) {
  const issues = [];
  const lines = content.split('\n');
  const extension = filename.split('.').pop().toLowerCase();

  // 1. Global Pattern Analysis (Line by Line for precision)
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Security: Hardcoded Secrets
    if (line.match(/(password|passwd|secret|api_key|apikey|token|auth_key)\s*[:=]\s*['"][^'"]+['"]/i)) {
      issues.push({ type: 'Critical Security', message: `Potential hardcoded secret found at line ${lineNum}.` });
    }

    // Quality: Unresolved markers
    if (line.includes('TODO') || line.includes('FIXME') || line.includes('XXX')) {
      issues.push({ type: 'Warning', message: `Unresolved marker at line ${lineNum}: ${line.trim()}` });
    }
  });

  // 2. Language Specific Deep Analysis
  switch (extension) {
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      analyzeJSAdvanced(content, lines, issues);
      break;
    case 'py':
      analyzePythonAdvanced(content, lines, issues);
      break;
    case 'html':
      analyzeHTMLAdvanced(content, lines, issues);
      break;
    case 'css':
      analyzeCSSAdvanced(content, lines, issues);
      break;
  }

  return issues;
}

function analyzeJSAdvanced(content, lines, issues) {
  // Check for eval() - Security Risk
  if (content.includes('eval(')) {
    issues.push({ type: 'Critical Security', message: 'Use of eval() detected. This is a major security risk.' });
  }

  // Check for innerHTML - XSS Risk
  if (content.includes('.innerHTML')) {
    issues.push({ type: 'Security', message: 'Use of .innerHTML detected. Consider .textContent to prevent XSS.' });
  }

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    // Best Practices
    if (line.includes('var ')) issues.push({ type: 'Best Practice', message: `Line ${lineNum}: Use 'const' or 'let' instead of 'var'.` });
    if (line.includes('== null')) issues.push({ type: 'Safety', message: `Line ${lineNum}: Use strict equality (===).` });
    
    // Performance
    if (line.match(/new Array\(\)/)) issues.push({ type: 'Performance', message: `Line ${lineNum}: Use array literal [] instead of new Array().` });
  });

  // Logic: Empty catch blocks
  const emptyCatch = content.match(/catch\s*\([^)]*\)\s*{\s*}/g);
  if (emptyCatch) {
    issues.push({ type: 'Bug', message: `${emptyCatch.length} empty catch blocks found. Errors are being swallowed.` });
  }
}

function analyzePythonAdvanced(content, lines, issues) {
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    if (line.includes('print(')) issues.push({ type: 'Cleanup', message: `Line ${lineNum}: Remove debug print statements.` });
    if (line.match(/except\s*:/)) issues.push({ type: 'Safety', message: `Line ${lineNum}: Bare except clause. Specify exception type.` });
    if (line.includes('os.system(')) issues.push({ type: 'Security', message: `Line ${lineNum}: os.system() is insecure. Use subprocess instead.` });
  });

  if (content.includes('import pdb') || content.includes('breakpoint()')) {
    issues.push({ type: 'Cleanup', message: 'Debugger entry points found in code.' });
  }
}

function analyzeHTMLAdvanced(content, lines, issues) {
  if (!content.includes('<!DOCTYPE html>')) issues.push({ type: 'Standard', message: 'Missing DOCTYPE declaration.' });
  if (!content.includes('lang=')) issues.push({ type: 'Accessibility', message: 'Missing lang attribute in <html> tag.' });
  
  lines.forEach((line, index) => {
    if (line.includes('<img') && !line.includes('alt=')) {
      issues.push({ type: 'Accessibility', message: `Line ${index + 1}: Image missing alt attribute.` });
    }
  });
}

function analyzeCSSAdvanced(content, lines, issues) {
  lines.forEach((line, index) => {
    if (line.includes('!important')) {
      issues.push({ type: 'Maintenance', message: `Line ${index + 1}: Avoid using !important for better specificity control.` });
    }
  });
}
