const aiService = require('../services/aiService');
const chalk = require('chalk');
const ora = require('ora');
const { saveLastResponse } = require('../utils/logger');
const { formatAIResponse, formatError } = require('../utils/responseFormatter');

module.exports = async (task) => {
  const spinner = ora('Generating code...').start();
  
  try {
    const prompt = `Generate code for the following task. Provide clean, well-commented, production-ready code with best practices:

Task: ${task}

Please include:
1. Complete code implementation
2. Brief explanation of the approach
3. Usage examples if applicable
4. Any necessary dependencies or setup instructions`;
    
    const response = await aiService.askAI(prompt);
    
    spinner.stop();
    
    // Format and print the response
    const formattedResponse = formatAIResponse('generate', task, response);
    console.log(formattedResponse);
    
    // Save the response for potential later use
    await saveLastResponse('generate', task, response);
    
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error:'), error.message);
  }
};
