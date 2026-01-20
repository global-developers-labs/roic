/**
 * ROC IO - DEEP HYPER BOT ENGINE
 * Advanced Deep Scanning with Automated Fix Suggestions
 */

export const EDITIONS = {
  STANDARD: { name: 'Standard Bot', speed: 'Normal', depth: 'Basic' },
  SPACE: { name: 'Space Bot', speed: 'Fast', depth: 'Advanced' },
  HYPER: { name: 'Hyper Bot', speed: 'Ultra-Fast', depth: 'Deep/Massive' },
  DEEP_HYPER: { name: 'Deep Hyper Bot', speed: 'Extreme', depth: '30x Deep Analysis + Auto-Fix' }
};

export async function analyzeFile(filename, content, edition = 'DEEP_HYPER') {
  const startTime = Date.now();
  const issues = [];
  const lines = content.split('\n');
  
  const patterns = [
    { 
      reg: /eval\s*\(([^)]+)\)/g, 
      severity: 50, 
      type: 'Critical Security', 
      msg: 'Dynamic Execution Detected',
      fix: (match) => `// FIX: Use safe alternatives like JSON.parse() or direct function calls.\n// Avoid: eval(${match[1]})`
    },
    { 
      reg: /catch\s*\([^)]*\)\s*{\s*}/g, 
      severity: 25, 
      type: 'Failure Risk', 
      msg: 'Empty Catch Block',
      fix: () => `catch (error) {\n  console.error("Error detected:", error);\n  // FIX: Add proper error handling or logging here\n}`
    },
    {
      reg: /var\s+([a-zA-Z0-9_$]+)\s*=/g,
      severity: 10,
      type: 'Best Practice',
      msg: 'Legacy Variable Declaration',
      fix: (match) => `const ${match[1]} =` // Suggesting const as default fix
    },
    {
      reg: /([a-zA-Z0-9_$]+)\s*==\s*null/g,
      severity: 15,
      type: 'Logic Risk',
      msg: 'Loose Null Check',
      fix: (match) => `${match[1]} === null`
    },
    {
      reg: /console\.log\(([^)]+)\)/g,
      severity: 5,
      type: 'Cleanup',
      msg: 'Production Debug Log',
      fix: () => `// FIX: Remove for production or use a logging library.`
    }
  ];

  patterns.forEach(p => {
    let match;
    while ((match = p.reg.exec(content)) !== null) {
      const lineIndex = content.substring(0, match.index).split('\n').length - 1;
      const originalLine = lines[lineIndex].trim();
      
      issues.push({ 
        type: p.type, 
        message: p.msg,
        line: lineIndex + 1,
        severity: p.severity,
        original: originalLine,
        suggestedFix: typeof p.fix === 'function' ? p.fix(match) : p.fix
      });
    }
  });

  return { issues, scanTime: Date.now() - startTime };
}

export function calculateRiskScore(allIssues) {
  let totalScore = 0;
  allIssues.forEach(issue => totalScore += issue.severity || 0);
  const probability = Math.min(Math.round((totalScore / 1500) * 100), 100);
  
  let status = 'STABLE';
  if (probability > 75) status = 'CRITICAL VULNERABILITY';
  else if (probability > 40) status = 'UNSTABLE';
  else if (probability > 10) status = 'STABLE WITH WARNINGS';

  return { probability, status };
}
