const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { getLastResponse } = require('../utils/logger');

module.exports = async (filename) => {
  try {
    const lastResponse = await getLastResponse();
    
    if (!lastResponse) {
      console.log(chalk.yellow('⚠️  No recent AI response found to save.'));
      return;
    }
    
    // Ensure filename has extension
    let outputFilename = filename;
    if (!path.extname(filename)) {
      outputFilename = `${filename}.md`;
    }
    
    // Create content with metadata
    const content = `# Codex CLI Response
    
**Command:** ${lastResponse.command}
**Query:** ${lastResponse.query}
**Timestamp:** ${lastResponse.timestamp}
**AI Provider:** ${lastResponse.provider || 'Unknown'}

---

${lastResponse.response}
`;
    
    // Write to file
    fs.writeFileSync(outputFilename, content, 'utf8');
    
    console.log(chalk.green(`✅ Response saved to: ${outputFilename}`));
    
  } catch (error) {
    console.error(chalk.red('Error saving file:'), error.message);
  }
};
