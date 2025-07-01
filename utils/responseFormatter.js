const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table3');

/**
 * Format a standard text response with a title
 * @param {string} title - The title of the response
 * @param {string} content - The content to display
 * @param {Object} options - Additional formatting options
 * @returns {string} - Formatted response
 */
function formatResponse(title, content, options = {}) {
  const defaultOptions = {
    padding: 1,
    margin: 1,
    borderColor: 'blue',
    title: chalk.bold.cyan(title),
    titleAlignment: 'center',
    borderStyle: 'round',
    width: 80
  };

  const boxOptions = { ...defaultOptions, ...options };
  
  return boxen(content, boxOptions);
}

/**
 * Format code blocks with syntax highlighting
 * @param {string} code - The code to format
 * @param {string} language - The language of the code
 * @returns {string} - Formatted code block
 */
function formatCodeBlock(code, language = '') {
  const highlight = require('highlight.js');
  
  const boxOptions = {
    padding: 1,
    margin: 1,
    borderColor: 'yellow',
    title: chalk.bold.yellow(language ? `${language} code` : 'Code'),
    titleAlignment: 'center',
    borderStyle: 'round',
    dimBorder: true,
    backgroundColor: '#222'
  };

  let highlighted;
  try {
    // Try to highlight with the specified language
    if (language && language !== '') {
      highlighted = highlight.highlight(code, { language }).value;
    } else {
      // Auto-detect language if not specified
      highlighted = highlight.highlightAuto(code).value;
    }
    
    // Convert HTML to ANSI colors
    const coloredCode = highlighted
      // Style comments
      .replace(/<span class="hljs-comment">(.*?)<\/span>/g, chalk.green('$1'))
      // Style keywords
      .replace(/<span class="hljs-keyword">(.*?)<\/span>/g, chalk.blue('$1'))
      // Style strings
      .replace(/<span class="hljs-string">(.*?)<\/span>/g, chalk.yellow('$1'))
      // Style numbers
      .replace(/<span class="hljs-number">(.*?)<\/span>/g, chalk.cyan('$1'))
      // Style function names
      .replace(/<span class="hljs-function">(.*?)<\/span>/g, chalk.magenta('$1'))
      // Style class names
      .replace(/<span class="hljs-title">(.*?)<\/span>/g, chalk.cyan('$1'))
      .replace(/<span class="hljs-title class_">(.*?)<\/span>/g, chalk.cyan.bold('$1'))
      // Style params
      .replace(/<span class="hljs-params">(.*?)<\/span>/g, chalk.white('$1'))
      // Style variables
      .replace(/<span class="hljs-variable">(.*?)<\/span>/g, chalk.red('$1'))
      // Style operators
      .replace(/<span class="hljs-operator">(.*?)<\/span>/g, chalk.white('$1'))
      // Style built-in types
      .replace(/<span class="hljs-built_in">(.*?)<\/span>/g, chalk.yellow('$1'))
      // Style meta tags
      .replace(/<span class="hljs-meta">(.*?)<\/span>/g, chalk.grey('$1'))
      // Style attributes
      .replace(/<span class="hljs-attr">(.*?)<\/span>/g, chalk.yellow('$1'))
      // Style tag names in markup
      .replace(/<span class="hljs-tag">(.*?)<\/span>/g, chalk.red('$1'))
      // Style markup attributes
      .replace(/<span class="hljs-name">(.*?)<\/span>/g, chalk.blue('$1'))
      // Remove any remaining HTML tags
      .replace(/<\/?[^>]+(>|$)/g, '')
      // Fix special HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
      
    return boxen(coloredCode, boxOptions);
  } catch (error) {
    // Fallback to plain text if highlighting fails
    return boxen(chalk.white(code), boxOptions);
  }
}

/**
 * Format error messages
 * @param {string} error - The error message
 * @returns {string} - Formatted error message
 */
function formatError(error) {
  return boxen(chalk.red(error), {
    padding: 1,
    margin: 1,
    borderColor: 'red',
    title: chalk.bold.red('Error'),
    titleAlignment: 'center',
    borderStyle: 'round'
  });
}

/**
 * Create a formatted table from data
 * @param {Array} headers - Table headers
 * @param {Array} data - Table data as array of arrays
 * @returns {string} - Formatted table
 */
function formatTable(headers, data) {
  const table = new Table({
    head: headers.map(h => chalk.cyan.bold(h)),
    style: {
      head: [], // Disable the default styling
      border: ['blue']
    },
    chars: {
      'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
      'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
      'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
      'right': '║', 'right-mid': '╢', 'middle': '│'
    }
  });

  // Add rows to table
  data.forEach(row => {
    table.push(row);
  });

  return table.toString();
}

/**
 * Format help/command information
 * @param {Array} commands - Array of command objects with name, description, and example
 * @returns {string} - Formatted help info
 */
function formatHelp(commands) {
  const table = new Table({
    head: [chalk.cyan.bold('Command'), chalk.cyan.bold('Description'), chalk.cyan.bold('Example')],
    colWidths: [20, 40, 30],
    wordWrap: true,
    style: {
      head: [], // Disable the default styling
      border: ['blue']
    }
  });

  commands.forEach(cmd => {
    table.push([
      chalk.green(cmd.name),
      cmd.description,
      chalk.yellow(cmd.example)
    ]);
  });

  return boxen(table.toString(), {
    padding: 1,
    margin: 1,
    borderColor: 'blue',
    title: chalk.bold.cyan('Available Commands'),
    titleAlignment: 'center',
    borderStyle: 'round'
  });
}

/**
 * Parse and detect code blocks in markdown-like text
 * @param {string} text - Text that might contain code blocks
 * @returns {string} - Formatted text with code blocks
 */
function parseAndFormatText(text) {
  // Regex to detect code blocks with optional language
  // This regex captures both the language specification and the code content
  const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
  
  // Replace each code block with formatted version
  return text.replace(codeBlockRegex, (match, language, code) => {
    return formatCodeBlock(code.trim(), language.trim());
  });
}

/**
 * Format the AI response with nice formatting
 * @param {string} category - Category of the response (ask, explain, debug, etc.)
 * @param {string} query - The original query
 * @param {string} response - The AI's response
 * @returns {string} - Nicely formatted response
 */
function formatAIResponse(category, query, response) {
  let title = 'AI Response';
  let borderColor = 'blue';
  
  // Customize based on command category
  switch (category.toLowerCase()) {
    case 'ask':
      title = '💡 Answer';
      break;
    case 'explain':
      title = '📚 Explanation';
      break;
    case 'debug':
      title = '🔧 Debug Solution';
      borderColor = 'yellow';
      break;
    case 'generate':
      title = '✨ Generated Code';
      borderColor = 'green';
      break;
  }

  // Format the query
  const formattedQuery = boxen(chalk.italic(query), {
    padding: 1,
    margin: { top: 1, bottom: 0, left: 1, right: 1 },
    borderColor: 'gray',
    title: chalk.bold.blue('Your Query'),
    titleAlignment: 'center',
    borderStyle: 'round'
  });

  // Format the response with parsed code blocks
  const formattedResponse = boxen(parseAndFormatText(response), {
    padding: 1,
    margin: { top: 0, bottom: 1, left: 1, right: 1 },
    borderColor,
    title: chalk.bold.cyan(title),
    titleAlignment: 'center',
    borderStyle: 'round'
  });

  return `${formattedQuery}\n${formattedResponse}`;
}

module.exports = {
  formatResponse,
  formatCodeBlock,
  formatError,
  formatTable,
  formatHelp,
  parseAndFormatText,
  formatAIResponse
};
