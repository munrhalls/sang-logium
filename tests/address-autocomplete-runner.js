#!/usr/bin/env node

/**
 * Address Autocomplete Test Runner
 * 
 * This script runs the Playwright test for the address autocomplete feature
 * and generates a simple test report.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Address Autocomplete Test...');

// Ensure the test directory exists
const testDir = path.join(__dirname);
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

try {
  // Run the test and capture output
  const testOutput = execSync('npx playwright test tests/address-autocomplete.spec.ts --reporter=line', { 
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  // Parse test results from output logs
  const resultLines = testOutput.split('\n');
  
  // Extract feature status, response time, and usability rating
  const reportLineIndex = resultLines.findIndex(line => line.includes('=== ADDRESS AUTOCOMPLETE TEST REPORT ==='));
  
  if (reportLineIndex !== -1) {
    const reportSection = resultLines.slice(reportLineIndex);
    
    // Extract key metrics
    const featureWorking = reportSection.find(line => line.includes('Feature working'))?.split(':')[1]?.trim() || 'Unknown';
    const responseTime = reportSection.find(line => line.includes('Response time'))?.split(':')[1]?.trim() || 'Unknown';
    const suggestionsQuality = reportSection.find(line => line.includes('Suggestions quality'))?.split(':')[1]?.trim() || 'Unknown';
    const usabilityRating = reportSection.find(line => line.includes('Usability rating'))?.split(':')[1]?.trim() || 'Unknown';
    const criticalIssues = reportSection.find(line => line.includes('Critical issues'))?.split(':')[1]?.trim() || 'None';
    
    // Generate simple report
    const report = `
📊 ADDRESS AUTOCOMPLETE TEST REPORT
=====================================
✅ Feature working: ${featureWorking}
⏱️ Response time: ${responseTime}
🎯 Suggestions quality: ${suggestionsQuality}
⭐ Usability rating: ${usabilityRating}
⚠️ Critical issues: ${criticalIssues}
=====================================
    `;
    
    console.log(report);
    
    // Write report to file
    fs.writeFileSync(path.join(testDir, 'address-autocomplete-report.txt'), report);
    console.log('📝 Report saved to tests/address-autocomplete-report.txt');
    
  } else {
    console.error('❌ Could not find test report section in output');
  }
  
} catch (error) {
  console.error('❌ Test execution failed:');
  console.error(error.message);
  
  // Write error report
  fs.writeFileSync(
    path.join(testDir, 'address-autocomplete-report.txt'), 
    `❌ TEST FAILED\n\nError: ${error.message}\n\nPlease check the Playwright test configuration and try again.`
  );
}