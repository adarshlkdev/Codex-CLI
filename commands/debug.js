const aiService = require('../services/aiService');
const chalk = require('chalk');
const ora = require('ora');
const { saveLastResponse } = require('../utils/logger');
const { formatAIResponse, formatError } = require('../utils/responseFormatter');

module.exports = async (error) => {
  const spinner = ora('Analyzing error...').start();
  
  try {
    const prompt = `Debug this error and provide possible solutions with explanations:

Error: ${error}

Please provide:
1. What this error means
2. Common causes
3. Step-by-step solutions
4. Prevention tips`;
    
    const response = await aiService.askAI(prompt);
    
    spinner.stop();
    
    // Format and print the response
    const formattedResponse = formatAIResponse('debug', error, response);
    console.log(formattedResponse);
    
    // Save the response for potential later use
    await saveLastResponse('debug', error, response);
    
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error:'), error.message);
  }
};
