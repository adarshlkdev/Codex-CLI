const axios = require('axios');
const chalk = require('chalk');
require('dotenv').config();

class AIService {
  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY2;
    this.provider = process.env.AI_PROVIDER || 'gemini1';
    if (!this.geminiKey) {
      console.warn(chalk.yellow('Warning: GEMINI_API_KEY not found in .env file'));
    }
  }

  getProvider() {
    return this.provider;
  }

  refreshProvider() {
    // Re-read environment variables
    require('dotenv').config();
    this.provider = process.env.AI_PROVIDER || 'gemini1';
    this.geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY2;
    return this.provider;
  }

  async askAI(prompt, context = '') {
    try {
      const fullPrompt = context ? `${context}\n\nUser Query: ${prompt}` : prompt;
      
      // Get the appropriate API key based on provider
      this.updateApiKeyFromProvider();
      
      if (!this.geminiKey) {
        throw new Error('GEMINI_API_KEY not found. Please set up your Gemini API key in .env file.');
      }
      
      return await this.askGemini(fullPrompt);
    } catch (error) {
      // Let the calling function handle the error with the formatter
      throw error;
    }
  }

  updateApiKeyFromProvider() {
    if (this.provider === 'gemini1') {
      this.geminiKey = process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY;
    } else if (this.provider === 'gemini2') {
      this.geminiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY;
    } else {
      this.geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    }
  }

  async askGemini(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a helpful AI programming assistant.
Provide clear, concise, and practical answers.
Format code with proper syntax highlighting.

${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const candidate = response.data?.candidates?.[0];
    if (!candidate) {
      throw new Error("No response generated from Gemini API");
    }

    return candidate.content.parts.map(p => p.text).join("");
  } catch (error) {
    console.error(
      chalk.red("Gemini API Error:"),
      error.response?.data || error.message
    );
    throw error;
  }
}
}

module.exports = new AIService();
