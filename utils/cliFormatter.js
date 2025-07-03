const { formatTable, formatResponse } = require('../utils/responseFormatter');
const boxen = require('boxen');
const chalk = require('chalk');

/**
 * Format the CLI help output to make it more user-friendly and visually appealing
 * @param {Object} program - The Commander.js program instance
 * @returns {string} - Formatted help output
 */
function formatHelpOutput(program) {
  // Extract commands from program
  const commands = [];
  program.commands.forEach(cmd => {
    commands.push({
      name: cmd.name(),
      description: cmd.description(),
      example: `codex ${cmd.name()}${cmd.usage() ? ' ' + cmd.usage() : ''}`
    });
  });
  
  // Create the table
  const headers = ['Command', 'Description', 'Example'];
  const rows = commands.map(cmd => [
    chalk.green(cmd.name),
    cmd.description,
    chalk.yellow(cmd.example)
  ]);
  
  const table = formatTable(headers, rows);
  
  // Footer with tips
  const footer = boxen(
    chalk.gray(`Tips:
- Run 'codex config' to set your API preferences
- Use 'codex chat' for extended interactive sessions
- Save responses with 'codex save <filename>'`),
    {
      padding: 1,
      margin: { top: 0, bottom: 1 },
      borderColor: 'gray',
      borderStyle: 'round',
      title: chalk.gray('Quick Tips'),
      titleAlignment: 'center'
    }
  );
  
  return `${table}\n\n${footer}`;
}

module.exports = { formatHelpOutput };
