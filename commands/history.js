const chalk = require('chalk');
const { getHistory } = require('../utils/logger');

module.exports = async () => {
  try {
    const history = await getHistory();
    
    if (!history || history.length === 0) {
      console.log(chalk.yellow('📝 No command history found.'));
      return;
    }
    
    console.log(chalk.blue('📋 Command History:\n'));
    
    history.slice(-10).forEach((entry, index) => {
      console.log(chalk.cyan(`${index + 1}. [${entry.command}] ${entry.timestamp}`));
      console.log(chalk.gray(`   Query: ${entry.query.substring(0, 80)}${entry.query.length > 80 ? '...' : ''}`));
      console.log(chalk.gray(`   Response: ${entry.response.substring(0, 100)}${entry.response.length > 100 ? '...' : ''}`));
      console.log();
    });
    
    console.log(chalk.gray(`Showing last ${Math.min(history.length, 10)} entries`));
    
  } catch (error) {
    console.error(chalk.red('Error retrieving history:'), error.message);
  }
};
