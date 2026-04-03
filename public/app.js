const micButton = document.getElementById('micButton');
const transcriptBox = document.getElementById('transcript');
const responseBox = document.getElementById('response');
const statusText = document.getElementById('status');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionSupported = Boolean(SpeechRecognition);

let recognition;
let isListening = false;

function setStatus(value) {
  statusText.textContent = `Status: ${value}`;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    setStatus('Done (speech synthesis not supported)');
    return;
  }

  // Stop any current speech before speaking a new response.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onstart = () => setStatus('Speaking...');
  utterance.onend = () => setStatus('Idle');
  utterance.onerror = () => setStatus('Idle (speech error)');

  window.speechSynthesis.speak(utterance);
}

async function sendMessageToBackend(message) {
  setStatus('Thinking...');

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data.reply;
}

function initRecognition() {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    micButton.classList.add('listening');
    setStatus('Listening...');
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    transcriptBox.textContent = text;

    try {
      const reply = await sendMessageToBackend(text);
      responseBox.textContent = reply;
      speakText(reply);
    } catch (error) {
      responseBox.textContent = error.message;
      setStatus('Idle (error)');
    }
  };

  recognition.onerror = (event) => {
    responseBox.textContent = `Speech recognition error: ${event.error}`;
    setStatus('Idle (speech error)');
  };

  recognition.onend = () => {
    isListening = false;
    micButton.classList.remove('listening');

    // If we are not speaking, reset status to idle.
    if (!window.speechSynthesis?.speaking) {
      setStatus('Idle');
    }
  };
}

micButton.addEventListener('click', () => {
  if (!recognitionSupported) {
    setStatus('Speech recognition not supported in this browser');
    responseBox.textContent = 'Please use Chrome or Edge for Web Speech API support.';
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  recognition.start();
});

if (recognitionSupported) {
  initRecognition();
} else {
  setStatus('Speech recognition not supported');
}

// TODO: Add basic conversation memory for follow-up questions.
// TODO: Add a wake word mode so the assistant can start hands-free.
// TODO: Add a local Ollama provider option in the UI.
// TODO: Add webhook/n8n integration for automation workflows.
