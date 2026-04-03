# AI Voice Assistant Using Codex

A beginner-friendly starter project for building a web-based AI voice assistant.

This app lets you click a microphone button, speak into your browser, send the transcript to an AI model through a Node.js backend, and hear the model's response using browser text-to-speech.

## Project Overview

This project is designed for tutorials and demo videos:

- Simple architecture (frontend + Express backend)
- Easy-to-read JavaScript (no TypeScript)
- OpenAI-compatible backend helper for flexible model providers
- Clean UI with clear assistant states (Listening, Thinking, Speaking)

## Features

- 🎤 Large microphone button for voice input
- 🗣️ Browser speech recognition (Web Speech API)
- 🤖 `/api/chat` backend endpoint for AI responses
- 🔊 Browser speech synthesis for spoken output
- 🌙 Modern dark UI, responsive for desktop/mobile demos
- 🔁 Provider-ready structure for OpenAI-compatible APIs

## Folder Structure

```bash
ai-voice-assistant-using-codex/
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Setup

### 1) Clone and install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

- `OPENAI_API_KEY`: your API key
- `OPENAI_BASE_URL`: compatible base URL (default OpenAI)
- `OPENAI_MODEL`: model name
- `SYSTEM_PROMPT`: optional assistant behavior prompt

## Run Locally

```bash
npm start
```

Open: `http://localhost:3000`

## How the Voice Flow Works

1. User clicks mic button
2. Browser captures speech and converts it to text
3. Frontend sends text to `POST /api/chat`
4. Backend sends prompt to model provider
5. Backend returns AI reply as JSON
6. Frontend shows reply and reads it out loud

## Default System Prompt

Use this as a strong default prompt:

> You are a friendly AI voice assistant. Keep responses concise, clear, and helpful for beginners. Use plain language and short sentences when possible.

## Swapping Model Providers Later

The backend uses one helper function (`getModelResponse`) and OpenAI-compatible request format.

This makes migration easier for future tutorials, such as:

- OpenAI API
- Local Ollama (OpenAI-compatible mode)
- Gemini through compatible gateways/adapters

## Future Improvements

- Add conversation memory/context window
- Add wake-word support (hands-free mode)
- Add first-class local Ollama provider toggle
- Add n8n webhook/tool calling integration
- Add streaming responses for faster UX
- Add basic tests (API route + frontend behavior)

## Notes for Tutorial Recording

- Use Chrome/Edge for best Web Speech API support
- Keep browser mic permissions enabled
- If speech recognition is unavailable, the UI shows a fallback status

---

If you want, you can next split this into modular files (`routes/`, `services/`) once your tutorial audience is comfortable with the basics.
