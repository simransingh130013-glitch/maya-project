const responseEl = document.getElementById("response");
const subEl = document.getElementById("subResponse");
const input = document.getElementById("commandInput");
const log = document.getElementById("log");
const micBtn = document.getElementById("micBtn");
const micLabel = document.getElementById("micLabel");
const orbWrap = document.getElementById("orbWrap");
const statusText = document.getElementById("statusText");

function addLog(who, text) {
  const row = document.createElement("div");
  row.className = "msg";
  row.innerHTML = `<b>${who}:</b> ${escapeHtml(text)}`;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function speak(text) {
  responseEl.textContent = text;
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 1.0;
    speechSynthesis.speak(u);
  }
  addLog("Maya", text);
}

function openUrl(url) {
  window.location.href = url;
}

function processCommand(raw) {
  const command = raw.trim();
  const c = command.toLowerCase();
  if (!command) return;

  addLog("You", command);
  input.value = "";

  if (c === "maya" || c.includes("hey maya")) {
    speak("Yes boss");
    subEl.textContent = "I'm listening.";
    return;
  }

  if (c.includes("stop maya")) {
    speak("Goodbye boss");
    return;
  }

  if (c.includes("open youtube")) {
    speak("Opening YouTube");
    setTimeout(() => openUrl("https://www.youtube.com/"), 500);
    return;
  }

  if (c.includes("open google")) {
    speak("Opening Google");
    setTimeout(() => openUrl("https://www.google.com/"), 500);
    return;
  }

  if (c.startsWith("search google for ")) {
    const q = command.substring(18).trim();
    speak("Searching Google");
    setTimeout(() => openUrl("https://www.google.com/search?q=" + encodeURIComponent(q)), 500);
    return;
  }

  if (c.startsWith("search youtube for ")) {
    const q = command.substring(19).trim();
    speak("Searching YouTube");
    setTimeout(() => openUrl("https://www.youtube.com/results?search_query=" + encodeURIComponent(q)), 500);
    return;
  }

  if (c.startsWith("play ")) {
    const q = command.substring(5).trim();
    speak("Playing " + q + " on YouTube");
    setTimeout(() => openUrl("https://www.youtube.com/results?search_query=" + encodeURIComponent(q)), 500);
    return;
  }

  if (c.includes("tell me about yourself") || c.includes("introduce yourself") || c.includes("who are you")) {
    speak("Hello! I am Maya, your browser based AI assistant. I can listen to voice commands, open websites, search the web, and help with everyday tasks.");
    subEl.textContent = "Maya AI iPhone Edition";
    return;
  }

  speak("I heard you. This web edition can handle commands like open YouTube, open Google, search Google, search YouTube, and play a song.");
  subEl.textContent = "For full local AI chat, connect a backend later.";
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    micBtn.classList.add("listening");
    orbWrap.classList.add("listening");
    micLabel.textContent = "Listening...";
    statusText.textContent = "Listening";
    subEl.textContent = "Speak now...";
  };

  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    processCommand(text);
  };

  recognition.onerror = e => {
    statusText.textContent = "Ready";
    subEl.textContent = e.error === "not-allowed"
      ? "Microphone permission was denied."
      : "I couldn't hear that. Try again.";
  };

  recognition.onend = () => {
    micBtn.classList.remove("listening");
    orbWrap.classList.remove("listening");
    micLabel.textContent = "Talk to Maya";
    statusText.textContent = "Ready";
  };

  micBtn.addEventListener("click", () => {
    try { recognition.start(); } catch (_) {}
  });
} else {
  micBtn.addEventListener("click", () => {
    subEl.textContent = "Voice recognition is not available in this browser. Use the text box.";
  });
  micLabel.textContent = "Voice unavailable";
}

document.getElementById("sendBtn").addEventListener("click", () => processCommand(input.value));
input.addEventListener("keydown", e => {
  if (e.key === "Enter") processCommand(input.value);
});

document.querySelectorAll("[data-command]").forEach(btn => {
  btn.addEventListener("click", () => processCommand(btn.dataset.command));
});

document.getElementById("infoBtn").addEventListener("click", () => {
  document.getElementById("infoDialog").showModal();
});
document.getElementById("closeInfo").addEventListener("click", () => {
  document.getElementById("infoDialog").close();
});

speak("Hello Boss");
subEl.textContent = "Tap the microphone and say “Maya”.";
