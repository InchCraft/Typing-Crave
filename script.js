// ===== Elements =====
const promptBox      = document.getElementById("prompt");
const inputBox       = document.getElementById("inputBox");
const wpmEl          = document.getElementById("wpm");
const accEl          = document.getElementById("accuracy");
const newPromptBtn   = document.getElementById("newPromptBtn");
const finishedMsg    = document.getElementById("finishedMessage");

const settingsBtn    = document.getElementById("settingsBtn");
const settingsMenu   = document.getElementById("settingsMenu");
const closeSettings  = document.getElementById("closeSettings");
const overlay        = document.getElementById("overlay");
const themeSelect    = document.getElementById("themeSelect");
const soundToggle    = document.getElementById("soundToggle");

// ===== Sounds =====
const keySound    = new Audio("assets/sounds/keypress.mp3");
const finishSound = new Audio("assets/sounds/finish.mp3");

// ===== Prompts =====
const prompts = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast takes practice and patience every day.",
  "Accuracy first, speed second. Consistency makes progress.",
  "Coding is like puzzles, small steps unlock big results.",
  "Never stop learning, even ten minutes a day adds up.",
  "Do you like potatoes?",
  "A little progress every day can lead to something amazing.",
  "The best way to improve is to keep practicing.",
  "Sometimes the hardest part is simply getting started.",
  "Fast fingers are useful, but accurate fingers are better.",
  "The internet is full of strange and interesting things.",
  "What would you build if you could create anything?",
  "Robots might be doing some of our jobs one day.",
  "Every keyboard has a story waiting to be typed.",
  "Rain tapped against the window while the computer hummed.",
  "A good idea can start with just a few simple words.",
  "The spaceship launched into the night sky without a sound.",
  "Somewhere out there, someone is probably typing this sentence.",
  "Pizza tastes better when you are really hungry.",
  "Why do keyboards always seem louder at night?",
  "The tiny penguin confidently marched across the frozen lake.",
  "Learning something new is easier when you make it fun.",
  "One mistake does not ruin a good typing session.",
  "Keep your eyes on the screen and let your fingers do the work.",
  "The fastest typist is not always the most accurate one.",
  "Today is a pretty good day to learn something new.",
  "Imagine discovering a secret room behind your bookshelf.",
  "The moon looked unusually bright above the quiet town.",
  "If you could visit any planet, which one would you choose?",
  "Sometimes random ideas turn into the best projects.",
  "A computer can do amazing things with the right instructions."
];

// ===== State =====
let currentPrompt = "";
let startTime = null;
let finished = false;

// ===== Prompt loading =====
function loadPrompt() {
  currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  promptBox.innerHTML = [...currentPrompt].map(ch => `<span>${ch}</span>`).join("");
  inputBox.value = "";
  finished = false;
  startTime = null;
  wpmEl.textContent = "0";
  accEl.textContent = "100";
  finishedMsg.classList.remove("show");
  finishedMsg.textContent = "";
}
loadPrompt(); // ensure prompt is visible immediately

// ===== Typing logic =====
inputBox.addEventListener("input", () => {
  if (finished) return;
  if (!startTime) startTime = Date.now();

  // Play key sound (respect toggle)
  if (!soundToggle || soundToggle.checked) {
    try { keySound.currentTime = 0; keySound.play(); } catch(e) {}
  }

  const input = inputBox.value;
  const chars = promptBox.querySelectorAll("span");
  let correctChars = 0;

  // paint characters
  for (let i = 0; i < chars.length; i++) {
    const typed = input[i];
    const span = chars[i];
    if (typed == null) {
      span.classList.remove("correct","incorrect");
    } else if (typed === span.textContent) {
      span.classList.add("correct"); span.classList.remove("incorrect");
      correctChars++;
    } else {
      span.classList.add("incorrect"); span.classList.remove("correct");
    }
  }

  // stats
  const elapsedMin = Math.max( (Date.now() - startTime) / 60000, 1/60000 );
  const typedLen = Math.max(input.length, 1);
  const accuracy = Math.round((correctChars / typedLen) * 100);
  const rawWpm = (typedLen / 5) / elapsedMin;
  const adjWpm = Math.round(rawWpm * (accuracy / 100));

  wpmEl.textContent = String(adjWpm);
  accEl.textContent = String(isNaN(accuracy) ? 100 : accuracy);

  // finish when length reached (even with mistakes)
  if (input.length >= currentPrompt.length) {
    finished = true;
    try { if (!soundToggle || soundToggle.checked) finishSound.play(); } catch(e) {}
    finishedMsg.textContent = `✅ Finished! WPM: ${adjWpm} | Accuracy: ${accuracy}%`;
    finishedMsg.classList.add("show");
  }
});

// ===== New prompt =====
newPromptBtn.addEventListener("click", loadPrompt);

// ===== Settings drawer =====
function openSettings(){ settingsMenu.classList.add("open"); overlay.classList.add("active"); }
function closeSettingsFn(){ settingsMenu.classList.remove("open"); overlay.classList.remove("active"); }
settingsBtn.addEventListener("click", openSettings);
closeSettings.addEventListener("click", closeSettingsFn);
overlay.addEventListener("click", closeSettingsFn);

// ===== Theme switching =====
themeSelect.addEventListener("change", () => {
  document.body.classList.remove("classic","dark","light");
  document.body.classList.add(themeSelect.value);
});


