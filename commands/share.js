const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { getLastResponse } = require('../utils/logger');

module.exports = async () => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      console.log(chalk.yellow('⚠️  GitHub token not found in .env file.'));
      console.log(chalk.gray('Add GITHUB_TOKEN=your_token_here to enable Gist sharing.'));
      return;
    }
    
    const lastResponse = await getLastResponse();
    
    if (!lastResponse) {
      console.log(chalk.yellow('⚠️  No recent AI response found to share.'));
      return;
    }
    
    const spinner = ora('Creating GitHub Gist...').start();
    
    // Create Gist content
    const gistContent = `# Codex CLI Response
    
**Command:** ${lastResponse.command}
**Query:** ${lastResponse.query}
**Timestamp:** ${lastResponse.timestamp}
**AI Provider:** ${lastResponse.provider || 'Unknown'}

---

${lastResponse.response}
`;
    
    const gistData = {
      description: `Codex CLI - ${lastResponse.command}: ${lastResponse.query}`,
      public: false, // Private gist by default
      files: {
        [`codex-cli-${Date.now()}.md`]: {
          content: gistContent
        }
      }
    };
    
    const response = await axios.post(
      'https://api.github.com/gists',
      gistData,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    spinner.stop();
    
    console.log(chalk.green('✅ Gist created successfully!'));
    console.log(chalk.blue(`🔗 URL: ${response.data.html_url}`));
    
  } catch (error) {
    const spinner = ora();
    spinner.stop();
    
    if (error.response && error.response.status === 401) {
      console.error(chalk.red('❌ Invalid GitHub token. Please check your GITHUB_TOKEN in .env file.'));
    } else {
      console.error(chalk.red('Error creating Gist:'), error.message);
    }
  }
};
