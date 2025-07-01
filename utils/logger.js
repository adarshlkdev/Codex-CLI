const fs = require('fs');
const path = require('path');
const os = require('os');

// Create logs directory in user's home directory
const LOGS_DIR = path.join(os.homedir(), '.codex-cli');
const HISTORY_FILE = path.join(LOGS_DIR, 'history.json');
const LAST_RESPONSE_FILE = path.join(LOGS_DIR, 'last-response.json');

// Ensure logs directory exists
function ensureLogsDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

// Save the last AI response for potential reuse
async function saveLastResponse(command, query, response) {
  try {
    ensureLogsDir();
    
    const responseData = {
      command,
      query,
      response,
      timestamp: new Date().toISOString(),
      provider: process.env.AI_PROVIDER || 'unknown'
    };
    
    fs.writeFileSync(LAST_RESPONSE_FILE, JSON.stringify(responseData, null, 2));
    
    // Also add to history
    await addToHistory(responseData);
    
  } catch (error) {
    console.error('Error saving response:', error.message);
  }
}

// Get the last AI response
async function getLastResponse() {
  try {
    ensureLogsDir();
    
    if (!fs.existsSync(LAST_RESPONSE_FILE)) {
      return null;
    }
    
    const data = fs.readFileSync(LAST_RESPONSE_FILE, 'utf8');
    return JSON.parse(data);
    
  } catch (error) {
    console.error('Error reading last response:', error.message);
    return null;
  }
}

// Add entry to history
async function addToHistory(responseData) {
  try {
    ensureLogsDir();
    
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      const historyData = fs.readFileSync(HISTORY_FILE, 'utf8');
      history = JSON.parse(historyData);
    }
    
    history.push(responseData);
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    
  } catch (error) {
    console.error('Error saving to history:', error.message);
  }
}

// Get command history
async function getHistory() {
  try {
    ensureLogsDir();
    
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
    
  } catch (error) {
    console.error('Error reading history:', error.message);
    return [];
  }
}

// Clear history
async function clearHistory() {
  try {
    ensureLogsDir();
    
    if (fs.existsSync(HISTORY_FILE)) {
      fs.unlinkSync(HISTORY_FILE);
    }
    
    if (fs.existsSync(LAST_RESPONSE_FILE)) {
      fs.unlinkSync(LAST_RESPONSE_FILE);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing history:', error.message);
    return false;
  }
}

module.exports = {
  saveLastResponse,
  getLastResponse,
  addToHistory,
  getHistory,
  clearHistory
};
