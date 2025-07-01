const aiService = require('../services/aiService');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { saveLastResponse } = require('../utils/logger');
const { formatResponse, parseAndFormatText, formatError } = require('../utils/responseFormatter');
const boxen = require('boxen');

module.exports = async () => {
  // Create a nice welcome box
  const welcomeBox = boxen(
    chalk.blue('Welcome to Interactive Chat Mode\nType "exit" or "quit" to end the chat session'),
    {
      padding: 1,
      margin: 1,
      borderColor: 'cyan',
      borderStyle: 'round',
      title: chalk.bold.cyan('💬 Codex Chat'),
      titleAlignment: 'center'
    }
  );
  console.log(welcomeBox);
  
  let chatHistory = [];
  
  while (true) {
    try {
      const { question } = await inquirer.prompt([
        {
          type: 'input',
          name: 'question',
          message: chalk.cyan('You:'),
          prefix: chalk.bold.blue('➤'),
        }
      ]);
      
      if (question.toLowerCase() === 'exit' || question.toLowerCase() === 'quit') {
        console.log(boxen(chalk.yellow('Chat session ended. Goodbye!'), {
          padding: 1,
          margin: 1,
          borderColor: 'yellow',
          borderStyle: 'round',
          title: chalk.bold.yellow('👋 Farewell'),
          titleAlignment: 'center'
        }));
        break;
      }
      
      if (!question.trim()) {
        continue;
      }
      
      const spinner = ora('AI is thinking...').start();
      
      // Build context from chat history
      const context = chatHistory.length > 0 
        ? `Previous conversation context:\n${chatHistory.slice(-6).join('\n')}\n` 
        : '';
      
      try {
        const response = await aiService.askAI(question, context);
        
        spinner.stop();
        
        // Format the AI response with nice formatting and code block parsing
        const formattedResponse = boxen(parseAndFormatText(response), {
          padding: 1,
          margin: { top: 1, bottom: 1, left: 2, right: 2 },
          borderColor: 'green',
          title: chalk.bold.green('🤖 AI'),
          titleAlignment: 'center',
          borderStyle: 'round'
        });
        console.log(formattedResponse);
        
        // Update chat history
        chatHistory.push(`User: ${question}`);
        chatHistory.push(`AI: ${response}`);
        
        // Save the last response
        await saveLastResponse('chat', question, response);
      } catch (error) {
        spinner.stop();
        console.log(formatError(`Failed to get response: ${error.message}`));
      }
      
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
      console.log();
    }
  }
};
