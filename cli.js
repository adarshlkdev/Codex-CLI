#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const explain = require('./commands/explain');
const debug = require('./commands/debug');
const generate = require('./commands/generate');
const ask = require('./commands/ask');
const chat = require('./commands/chat');
const save = require('./commands/save');
const history = require('./commands/history');
const share = require('./commands/share');
const config = require('./commands/config');
const { formatHelpOutput } = require('./utils/cliFormatter');

// Display brand name in a stylish box
const titleText = figlet.textSync('CODEX CLI', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
});

console.log(
  boxen(
    chalk.cyan(titleText) + 
    '\n\n' + chalk.blue('🚀 Your AI Dev Companion') + 
    '\n' + chalk.yellow('Created by Adarsh'),
    {
      padding: 1,
      margin: 1,
      borderColor: 'cyan',
      borderStyle: 'round',
      textAlignment: 'center',
      title: chalk.bold.cyan('Welcome to'),
      titleAlignment: 'center'
    }
  )
);

program
  .name('codex')
  .description('AI-powered CLI tool for developers')
  .version('1.0.0');

program
  .command('explain <topic>')
  .description('Explain a coding concept or technology')
  .action(explain);

program
  .command('debug <error>')
  .description('Get help debugging an error')
  .action((error) => debug(error));

program
  .command('generate <task>')
  .description('Generate code snippets for a specific task')
  .action((task) => generate(task));

program
  .command('ask <question>')
  .description('Ask any programming question to the AI')
  .action((question) => ask(question));

program
  .command('chat')
  .description('Start interactive chat mode')
  .action(chat);

program
  .command('save <filename>')
  .description('Save the last AI response to a file')
  .action((filename) => save(filename));

program
  .command('history')
  .description('Show past queries and responses')
  .action(history);

program
  .command('share')
  .description('Share the last response to GitHub Gist')
  .action(share);

program
  .command('config')
  .description('Configure AI model preferences')
  .action(config);

// Handle unknown commands
program.on('command:*', function () {
  console.error(boxen(
    chalk.red(`Invalid command: ${program.args.join(' ')}\nRun 'codex --help' for a list of available commands.`),
    {
      padding: 1,
      margin: 1,
      borderColor: 'red',
      borderStyle: 'round',
      title: chalk.bold.red('Error'),
      titleAlignment: 'center'
    }
  ));
  process.exit(1);
});

// Override the default help output with our formatted version
const originalHelp = program.outputHelp;
program.outputHelp = function() {
  console.log(formatHelpOutput(program));
};

program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
