/**
 * ROC IO Code Analyzer Bot
 * This bot performs local analysis on code files to detect common patterns and potential bugs.
 */

export async function analyzeFile(filename, content) {
  const issues = [];
  const extension = filename.split('.').pop().toLowerCase();

  // Common patterns for all files
  if (content.includes('TODO') || content.includes('FIXME')) {
    issues.push({ type: 'Warning', message: 'Unresolved TODO or FIXME comments found.' });
  }

  // Language specific analysis
  switch (extension) {
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      analyzeJavaScript(content, issues);
      break;
    case 'py':
      analyzePython(content, issues);
      break;
    case 'html':
      analyzeHTML(content, issues);
      break;
    default:
      // Generic analysis for other types
      if (content.length > 5000) {
        issues.push({ type: 'Optimization', message: 'File is quite large, consider breaking it down.' });
      }
  }

  return issues;
}

function analyzeJavaScript(content, issues) {
  if (content.includes('console.log')) {
    issues.push({ type: 'Cleanup', message: 'Production code might contain console.log statements.' });
  }
  if (content.includes('var ')) {
    issues.push({ type: 'Best Practice', message: 'Use "let" or "const" instead of "var".' });
  }
  if (content.includes('== null') || content.includes('== undefined')) {
    issues.push({ type: 'Safety', message: 'Use strict equality (===) for null/undefined checks.' });
  }
  if (content.match(/catch\s*\(\s*e\s*\)\s*{\s*}/)) {
    issues.push({ type: 'Bug', message: 'Empty catch block detected. Errors might be silently ignored.' });
  }
}

function analyzePython(content, issues) {
  if (content.includes('print(')) {
    issues.push({ type: 'Cleanup', message: 'Consider using a logging framework instead of print().' });
  }
  if (content.includes('except:')) {
    issues.push({ type: 'Safety', message: 'Bare except clause detected. It can catch unexpected errors like SystemExit.' });
  }
}

function analyzeHTML(content, issues) {
  if (!content.includes('alt=')) {
    issues.push({ type: 'Accessibility', message: 'Images might be missing alt attributes.' });
  }
}
