/**
 * ROC IO - MULTI-EDITION ANALYZER ENGINE
 * Editions: STANDARD, SPACE, HYPER
 */

export const EDITIONS = {
  STANDARD: { name: 'Standard Bot', speed: 'Normal', depth: 'Basic' },
  SPACE: { name: 'Space Bot', speed: 'Fast', depth: 'Advanced' },
  HYPER: { name: 'Hyper Bot', speed: 'Ultra-Fast', depth: 'Deep/Massive' }
};

export async function analyzeFile(filename, content, edition = 'HYPER') {
  const startTime = Date.now();
  const issues = [];
  
  // Base patterns for all editions
  const basePatterns = [
    { reg: /eval\s*\(/g, severity: 50, type: 'Critical Security', msg: 'Dynamic Execution' },
    { reg: /catch\s*\([^)]*\)\s*{\s*}/g, severity: 25, type: 'Failure Risk', msg: 'Silent Error' }
  ];

  // Hyper-specific deep scanning patterns
  const hyperPatterns = edition === 'HYPER' ? [
    { reg: /(password|secret|key|token)\s*[:=]\s*['"][^'"]{5,}['"]/gi, severity: 40, type: 'Security', msg: 'Hardcoded Secret' },
    { reg: /http:\/\//gi, severity: 15, type: 'Protocol', msg: 'Insecure HTTP' },
    { reg: /dangerouslySetInnerHTML/g, severity: 45, type: 'XSS', msg: 'Insecure React Render' },
    { reg: /== null/g, severity: 10, type: 'Logic', msg: 'Loose Null Check' },
    { reg: /console\.log/g, severity: 5, type: 'Cleanup', msg: 'Debug Log' }
  ] : [];

  const activePatterns = [...basePatterns, ...hyperPatterns];

  // Ultra-optimized single-pass scan
  activePatterns.forEach(p => {
    let match;
    while ((match = p.reg.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({ type: p.type, message: `Line ${lineNum}: ${p.msg}`, severity: p.severity });
    }
  });

  return { issues, scanTime: Date.now() - startTime };
}

export function calculateRiskScore(allIssues) {
  let totalScore = 0;
  allIssues.forEach(issue => totalScore += issue.severity || 0);
  const probability = Math.min(Math.round((totalScore / 1000) * 100), 100);
  
  let status = 'STABLE';
  if (probability > 80) status = 'CRITICAL FAILURE';
  else if (probability > 50) status = 'HIGH RISK';
  else if (probability > 20) status = 'MODERATE';

  return { probability, status };
}
