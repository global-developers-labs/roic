/**
 * X-Bot: The Cyber Security Specialist
 * Part of the ROIC Ecosystem
 * Developed by Manus for Global Developers Labs
 */

class XBot {
    constructor() {
        this.name = "X-Bot";
        this.edition = "Cyber Security Edition";
        this.speed = "Hyper-Hyper Deep";
        this.vulnerabilityPatterns = [
            { name: "SQL Injection", regex: /(SELECT|INSERT|UPDATE|DELETE|DROP).*WHERE.*=.*(\+|,|\$|req\.query|req\.body)/i, severity: "Critical" },
            { name: "Cross-Site Scripting (XSS)", regex: /(res\.send|res\.write|innerHTML|outerHTML).*(\+|,|\$|req\.query|req\.body)/i, severity: "High" },
            { name: "Hardcoded Credentials", regex: /(password|secret|api_key|token|private_key)\s*[:=]\s*["'][^"']+["']/i, severity: "Critical" },
            { name: "Insecure Randomness", regex: /Math\.random\(\)/, severity: "Low" },
            { name: "Command Injection", regex: /(exec|spawn|eval)\(.*\+.*(req\.query|req\.body)/i, severity: "Critical" },
            { name: "Weak Hashing", regex: /(md5|sha1)\(/i, severity: "Medium" },
            { name: "Path Traversal", regex: /fs\.(readFile|writeFile|access).*(\+|,|\$|req\.query|req\.body)/i, severity: "High" },
            { name: "NoSQL Injection", regex: /\.find\(.*(\$where|req\.query|req\.body)/i, severity: "High" }
        ];
    }

    async scan(filePath, content) {
        console.log(`[${this.name}] 🛡️ Scanning ${filePath} for deep and shallow vulnerabilities...`);
        const findings = [];
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            this.vulnerabilityPatterns.forEach(pattern => {
                if (pattern.regex.test(line)) {
                    findings.push({
                        file: filePath,
                        line: index + 1,
                        vulnerability: pattern.name,
                        severity: pattern.severity,
                        snippet: line.trim()
                    });
                }
            });
        });

        return findings;
    }

    report(findings) {
        console.log(`\n[${this.name}] 📊 Cyber Security Scan Report`);
        console.log(`=========================================`);
        if (findings.length === 0) {
            console.log("✅ No vulnerabilities detected. System is secure.");
        } else {
            findings.forEach(f => {
                console.log(`[${f.severity}] ${f.vulnerability} found in ${f.file} at line ${f.line}`);
                console.log(`   > ${f.snippet}`);
            });
            console.log(`\nTotal Vulnerabilities Found: ${findings.length}`);
        }
        console.log(`=========================================\n`);
    }
}

module.exports = XBot;
