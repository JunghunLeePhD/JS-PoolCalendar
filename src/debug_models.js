// src/debug_models.js
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    '❌ Error: GEMINI_API_KEY is missing from environment variables.'
  );
  process.exit(1);
}

async function listModels() {
  try {
    console.log('Fetching available models...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await axios.get(url);

    console.log('\n✅ AVAILABLE MODELS:');
    const models = response.data.models;

    // Filter for Gemini models and print their 'name'
    models.forEach((m) => {
      if (m.name.includes('gemini')) {
        console.log(`- ${m.name.replace('models/', '')}`);
      }
    });
  } catch (error) {
    console.error(
      '❌ Failed to fetch models:',
      error.response ? error.response.data : error.message
    );
  }
}

listModels();
