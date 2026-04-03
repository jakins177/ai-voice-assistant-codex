require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  'You are a friendly AI voice assistant. Keep responses concise, clear, and helpful for beginners. Use plain language and short sentences when possible.';

/**
 * Sends a chat prompt to any OpenAI-compatible endpoint.
 *
 * This makes it easy to swap providers later (OpenAI, Ollama, Gemini-compatible gateway, etc.)
 * by changing environment variables instead of rewriting app logic.
 */
async function getModelResponse(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment variables.');
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid message string.' });
  }

  try {
    const reply = await getModelResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error.message);
    res.status(500).json({
      error: 'Sorry, something went wrong while contacting the AI model. Please check your API settings.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
