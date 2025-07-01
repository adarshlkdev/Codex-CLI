#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const boxen = require('boxen');
const os = require('os');

// Define the path to the user's home directory for storing the .env file
const homedir = os.homedir();
const envFilePath = path.join(homedir, '.env.codex');

async function setupConfig() {
  console.log(boxen(chalk.cyan('Codex CLI Setup') + '\n\n' + chalk.blue('Configure your AI providers'), {
    padding: 1,
    margin: 1,
    borderColor: 'cyan',
    borderStyle: 'round'
  }));

  const providerChoices = [
    { name: 'OpenAI (GPT models)', value: 'openai' },
    { name: 'Google Gemini', value: 'gemini' },
    { name: 'Both providers', value: 'both' },
  ];

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Which AI provider would you like to use?',
      choices: providerChoices
    }
  ]);

  const questions = [];

  if (answers.provider === 'openai' || answers.provider === 'both') {
    questions.push({
      type: 'password',
      name: 'openaiKey',
      message: 'Enter your OpenAI API key:',
      validate: input => input.trim() ? true : 'API key is required'
    });
  }

  if (answers.provider === 'gemini' || answers.provider === 'both') {
    questions.push({
      type: 'password',
      name: 'geminiKey',
      message: 'Enter your Google Gemini API key:',
      validate: input => input.trim() ? true : 'API key is required'
    });
  }

  questions.push({
    type: 'confirm',
    name: 'setupGithub',
    message: 'Would you like to set up GitHub Gist sharing functionality?',
    default: false
  });

  const apiAnswers = await inquirer.prompt(questions);

  if (apiAnswers.setupGithub) {
    const githubAnswer = await inquirer.prompt([
      {
        type: 'password',
        name: 'githubToken',
        message: 'Enter your GitHub personal access token (with gist scope):',
        validate: input => input.trim() ? true : 'GitHub token is required'
      }
    ]);
    apiAnswers.githubToken = githubAnswer.githubToken;
  }

  // Create .env file content
  let envContent = `# Codex CLI Configuration\n`;
  envContent += `# Generated on ${new Date().toLocaleDateString()}\n\n`;
  
  // Set the default AI provider
  if (answers.provider === 'both') {
    envContent += `AI_PROVIDER=openai\n\n`;
  } else {
    envContent += `AI_PROVIDER=${answers.provider}\n\n`;
  }

  // Add API keys
  if (apiAnswers.openaiKey) {
    envContent += `OPENAI_API_KEY=${apiAnswers.openaiKey}\n`;
  }
  
  if (apiAnswers.geminiKey) {
    envContent += `GEMINI_API_KEY=${apiAnswers.geminiKey}\n`;
  }
  
  if (apiAnswers.githubToken) {
    envContent += `\nGITHUB_TOKEN=${apiAnswers.githubToken}\n`;
  }

  // Write the .env file
  try {
    fs.writeFileSync(envFilePath, envContent);
    console.log(boxen(
      chalk.green('✅ Configuration successful!') + '\n\n' +
      chalk.blue(`Configuration saved to: ${envFilePath}`) + '\n' +
      chalk.yellow('You can now use Codex CLI with the following commands:') + '\n\n' +
      chalk.cyan('codex explain "async/await in JavaScript"') + '\n' +
      chalk.cyan('codex debug "TypeError: undefined is not a function"') + '\n' +
      chalk.cyan('codex generate "Express REST API endpoint"'),
      {
        padding: 1,
        margin: 1,
        borderColor: 'green',
        borderStyle: 'round'
      }
    ));
  } catch (error) {
    console.error(boxen(
      chalk.red('❌ Failed to save configuration') + '\n\n' +
      chalk.yellow(`Error: ${error.message}`) + '\n\n' +
      chalk.blue('You can manually create a .env file in your home directory with:') + '\n' +
      chalk.cyan('AI_PROVIDER=openai') + '\n' +
      chalk.cyan('OPENAI_API_KEY=your_api_key') + '\n' +
      chalk.cyan('GEMINI_API_KEY=your_api_key'),
      {
        padding: 1,
        margin: 1,
        borderColor: 'red',
        borderStyle: 'round'
      }
    ));
  }
}

setupConfig().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
