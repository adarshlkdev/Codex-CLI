const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const aiService = require('../services/aiService');

module.exports = async () => {
  console.log(chalk.blue('⚙️  Codex CLI Configuration\n'));
  
  try {
    const currentProvider = aiService.getProvider();
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to configure?',
        choices: [
          'Switch AI Provider',
          'View Current Settings',
          'Test API Connection',
          'Exit'
        ]
      }
    ]);
    
    switch (action) {
      case 'Switch AI Provider':
        await switchProvider(currentProvider);
        break;
      case 'View Current Settings':
        await viewSettings();
        break;
      case 'Test API Connection':
        await testConnection();
        break;
      case 'Exit':
        console.log(chalk.gray('Configuration canceled.'));
        break;
    }
    
  } catch (error) {
    console.error(chalk.red('Configuration error:'), error.message);
  }
};

async function switchProvider(currentProvider) {
  const { newProvider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'newProvider',
      message: `Current provider: ${currentProvider}. Select new provider:`,
      choices: ['gemini1', 'gemini2'],
      default: currentProvider
    }
  ]);
  
  if (newProvider === currentProvider) {
    console.log(chalk.yellow('No change made.'));
    return;
  }
  
  // Update .env file
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /AI_PROVIDER=.*/,
      `AI_PROVIDER=${newProvider}`
    );
    fs.writeFileSync(envPath, envContent);
    
    // Refresh the aiService to pick up the new provider
    aiService.refreshProvider();
    
    console.log(chalk.green(`✅ AI provider switched to: ${newProvider}`));
    console.log(chalk.gray('Provider updated successfully. No restart required.'));
  } else {
    console.log(chalk.red('❌ .env file not found. Please create one with your API keys.'));
  }
}

async function viewSettings() {
  const currentProvider = aiService.getProvider();
  const hasGemini1 = !!process.env.GEMINI_API_KEY1 && process.env.GEMINI_API_KEY1 !== 'your_gemini_api_key_here';
  const hasGemini2 = !!process.env.GEMINI_API_KEY2 && process.env.GEMINI_API_KEY2 !== 'your_gemini_api_key_here';
  const hasGitHub = !!process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token_here';
  
  console.log(chalk.blue('\n📋 Current Configuration:'));
  console.log(chalk.gray('─'.repeat(30)));
  console.log(`AI Provider: ${chalk.cyan(currentProvider)}`);
  console.log(`Gemini API1: ${hasGemini1 ? chalk.green('✅ Configured') : chalk.red('❌ Not configured')}`);
  console.log(`Gemini API2: ${hasGemini2 ? chalk.green('✅ Configured') : chalk.red('❌ Not configured')}`);
  console.log(`GitHub Token: ${hasGitHub ? chalk.green('✅ Configured') : chalk.red('❌ Not configured')}`);
  console.log();
}

async function testConnection() {
  console.log(chalk.blue('🧪 Testing API connection...\n'));
  
  try {
    const testResponse = await aiService.askAI('Hello! This is a test message. Please respond with "API connection successful!"');
    
    if (testResponse.toLowerCase().includes('successful') || testResponse.toLowerCase().includes('test')) {
      console.log(chalk.green('✅ API connection test successful!'));
      console.log(chalk.gray('Response:'), testResponse.substring(0, 100) + '...');
    } else {
      console.log(chalk.yellow('⚠️  API responded, but test result unclear.'));
      console.log(chalk.gray('Response:'), testResponse.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log(chalk.red('❌ API connection test failed:'), error.message);
  }
}
