# 🚀 AI Codex CLI

A powerful command-line interface that brings AI assistance directly to your terminal. Get instant help with coding concepts, debugging, code generation, and more!

## ✨ Features

- **🤖 AI-Powered Assistance**: Integrated with OpenAI GPT and Google Gemini
- **💡 Multiple Commands**: Explain concepts, debug errors, generate code, and ask questions
- **💬 Interactive Chat**: Continuous conversation mode with context awareness
- **📝 History Tracking**: Save and review past queries and responses
- **🔄 Response Management**: Save responses to files and share via GitHub Gists
- **⚙️ Configurable**: Switch between AI providers and test connections
- **🎨 Beautiful UI**: Colorful output with ASCII art branding

## 🛠️ Installation

### Global Installation (Recommended)

Install the package globally to use it as a command-line tool:

```bash
npm install -g ai-codex-cli
```

After installation, you can use the tool with either `codex` or `ai` commands:

```bash
codex explain "async/await in JavaScript"
# OR
ai explain "async/await in JavaScript"
```

### Local Installation

To use it within a project:

```bash
npm install ai-codex-cli
```

### Set Up Your API Keys

After installation, run the config command to set up your API keys:

```bash
codex config
```

Or manually create a `.env` file in your home directory:

```env
# Choose your preferred AI provider
AI_PROVIDER=gemini  

# Add your API keys
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: GitHub token for sharing gists
GITHUB_TOKEN=your_github_token_here
```

## 🎯 Commands

### Core Commands

```bash
# Explain programming concepts
codex explain "async/awcodext in JavaScript"
codex explain "Docker containers"

# Debug errors and get solutions
codex debug "TypeError: Cannot read property 'length' of undefined"
codex debug "CORS error in Express.js"

# Generate code snippets
codex generate "React login form with validation"
codex generate "Python function to parse CSV files"

# Ask any programming question
codex ask "What's the difference between let and const?"
codex ask "How to optimize SQL queries?"

# Interactive chat mode
codex chat
```

### Utility Commands

```bash
# Save last response to file
codex save my-solution.md

# View command history
codex history

# Share last response to GitHub Gist
codex share

# Configure settings
codex config
```

## 🚀 Getting Started

1. **First, test your setup**:
   ```bash
   codex config
   # Choose "Test API Connection"
   ```

2. **Try explaining a concept**:
   ```bash
   codex explain "REST API"
   ```

3. **Generate some code**:
   ```bash
   codex generate "Express.js hello world server"
   ```

4. **Start an interactive chat**:
   ```bash
   codex chat
   ```

## 🔧 Configuration

### Switching AI Providers

You can easily switch between OpenAI and Gemini:

```bash
codex config
# Choose "Switch AI Provider"
```

Or manually edit your `.env` file:
```env
AI_PROVIDER=gemini  # or openai
```

### API Keys Setup

#### For Google Gemini:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

#### For OpenAI:
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create an API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

#### For GitHub Gists (optional):
1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Create a token with `gist` permissions
3. Add it to your `.env` file as `GITHUB_TOKEN`


## 🎨 Examples

### Explaining Concepts
```bash
$ codex explain "GraphQL vs REST"

🤖 Explaining: GraphQL vs REST

📖 Explanation:

GraphQL and REST are both approaches for building APIs, but they differ significantly...
[Detailed explanation follows]
```

### Debugging Errors
```bash
$ codex debug "Module not found error in Node.js"

🐛 Debugging Error: Module not found error in Node.js

🔧 Debug Analysis:

This error typically occurs when Node.js cannot locate a module...
[Detailed debugging steps follow]
```

### Code Generation
```bash
$ codex generate "Python function to validate email addresses"

⚡ Generating Code: Python function to validate email addresses

💻 Generated Code:

```python
import re

def validate_email(email):
    """
    Validates an email address using regex pattern
    [Complete implementation follows]
```

### Interactive Chat
```bash
$ codex chat

💬 Interactive Chat Mode
Type "exit" or "quit" to end the chat session

You: How do I handle errors in async functions?
AI: Great question! Here are the main ways to handle errors in async functions...

You: Can you show me an example?
AI: Certainly! Here's a practical example...
```

## 🤝 Contributing

Feel free to contribute by:
- Adding new commands
- Improving existing functionality
- Adding support for more AI providers
- Enhancing the user interface
- Fixing bugs

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Troubleshooting

### Common Issues

1. **"No valid AI provider configured"**
   - Check your `.env` file has the correct API keys
   - Run `codex config` to test your connection

2. **"Module not found" errors**
   - Run `npm install` to install dependencies

3. **"Permission denied" when running commands**
   - Make sure `cli.js` is executable: `chmod +x cli.js`

4. **API rate limits**
   - Both OpenAI and Gemini have rate limits
   - Wait a moment between requests if you hit limits

### Getting Help

- Use `codex --help` for command list
- Use `codex config` to test your setup
- Check the `.env` file for proper API key configuration
- Review command history with `codex history`

---

**Happy Coding! 🎉**

Made with ❤️ for developers who love AI assistance in their terminal.
