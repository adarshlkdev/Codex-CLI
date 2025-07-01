const aiService = require('../services/aiService');
const chalk = require('chalk');
const ora = require('ora');
const { saveLastResponse } = require('../utils/logger');
const { formatAIResponse, formatError } = require('../utils/responseFormatter');

module.exports = async (topic) => {
  const spinner = ora('Researching topic...').start();
  
  try {
    const prompt = `Explain the following programming concept or technology in simple, clear terms with practical examples: ${topic}`;
    const response = await aiService.askAI(prompt);
    
    spinner.stop();
    
    // Format and print the response
    const formattedResponse = formatAIResponse('explain', topic, response);
    console.log(formattedResponse);
    
    // Save the response for potential later use
    await saveLastResponse('explain', topic, response);
    
  } catch (error) {
    spinner.stop();
    console.log(formatError(`Failed to explain topic: ${error.message}`));
  }
};
