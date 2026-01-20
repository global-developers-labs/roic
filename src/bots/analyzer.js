/**
 * ROC IO - ULTRA FAST SPACE EDITION
 * Optimized for Light-Speed Scanning & Deep Risk Assessment
 */

export async function analyzeFile(filename, content) {
  const startTime = Date.now();
  const issues = [];
  const extension = filename.split('.').pop().toLowerCase();
  
  // Ultra-Fast Compiled Regex Patterns
  const SECURITY_PATTERNS = [
    { reg: /(password|secret|api_key|token|auth_key|private_key|access_key)\s*[:=]\s*['"][^'"]{5,}['"]/gi, severity: 40, type: 'Leak Risk', msg: 'Hardcoded Credential' },
    { reg: /eval\s*\(/g, severity: 50, type: 'Execution Risk', msg: 'Dynamic Code Execution' },
    { reg: /dangerouslySetInnerHTML/g, severity: 45, type: 'XSS Risk', msg: 'React Insecure Rendering' },
    { reg: /chmod\s+777/g, severity: 35, type: 'Permission Risk', msg: 'Overly Permissive Access' },
    { reg: /http:\/\/[a-z0-9]/gi, severity: 20, type: 'Transport Risk', msg: 'Insecure Protocol (HTTP)' }
  ];

  const LOGIC_PATTERNS = [
    { reg: /catch\s*\([^)]*\)\s*{\s*}/g, severity: 25, type: 'Failure Risk', msg: 'Silent Error Swallowing' },
    { reg: /if\s*\([^)]*==[^=][^)]*\)/g, severity: 15, type: 'Logic Risk', msg: 'Loose Equality Check' },
    { reg: /while\s*\(true\)/g, severity: 30, type: 'Stability Risk', msg: 'Potential Infinite Loop' },
    { reg: /JSON\.parse\s*\([^)]*\)/g, severity: 10, type: 'Parsing Risk', msg: 'Unsafe JSON Parsing' }
  ];

  // 1. Parallel Pattern Matching
  const allPatterns = [...SECURITY_PATTERNS, ...LOGIC_PATTERNS];
  
  // Use a single pass for all patterns to maximize speed
  allPatterns.forEach(p => {
    let match;
    while ((match = p.reg.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({ 
        type: p.type, 
        message: `Line ${lineNum}: ${p.msg}`,
        severity: p.severity 
      });
    }
  });

  // 2. Language Specific Heuristics (Optimized)
  if (['ts', 'tsx', 'js'].includes(extension)) {
    if (content.includes('any')) {
      const anyCount = (content.match(/: any/g) || []).length;
      if (anyCount > 5) issues.push({ type: 'Type Risk', message: `High usage of 'any' (${anyCount} times). System stability decreased.`, severity: 15 });
    }
  }

  const scanTime = Date.now() - startTime;
  return { issues, scanTime };
}

/**
 * Calculate Total System Failure Probability
 */
export function calculateRiskScore(allIssues) {
  let totalScore = 0;
  allIssues.forEach(issue => {
    totalScore += issue.severity || 0;
  });

  // Normalize score to 0-100%
  const probability = Math.min(Math.round((totalScore / 500) * 100), 100);
  
  let status = 'STABLE';
  if (probability > 70) status = 'CRITICAL FAILURE RISK';
  else if (probability > 40) status = 'UNSTABLE / VULNERABLE';
  else if (probability > 15) status = 'MODERATE RISK';

  return { probability, status };
}
