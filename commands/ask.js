const aiService = require('../services/aiService');
const chalk = require('chalk');
const ora = require('ora');
const { saveLastResponse } = require('../utils/logger');
const { formatAIResponse, formatError } = require('../utils/responseFormatter');

module.exports = async (question) => {
  // No need to print the question separately as it will be included in the formatted output
  
  const spinner = ora('Thinking...').start();
  
  try {
    const prompt = `Answer this programming-related question with detailed explanations and examples where helpful:

Question: ${question}`;
    
    const response = await aiService.askAI(prompt);
    
    spinner.stop();
    
    // Format and print the response
    const formattedResponse = formatAIResponse('ask', question, response);
    console.log(formattedResponse);
    
    // Save the response for potential later use
    await saveLastResponse('ask', question, response);
    
  } catch (error) {
    spinner.stop();
    console.log(formatError(`Failed to get answer: ${error.message}`));
  }
};
