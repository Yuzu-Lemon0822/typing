import { words } from "./data.js";

let currentWord = "";
let index = 0;
let textEl = null;

export function initGame() {
  textEl = document.getElementById("text");
  nextWord();
}

export function updateGame(key) {
  if (!currentWord) return;

  if (key === currentWord[index]) {
    index++;
    updateText();

    if (index === currentWord.length) {
      nextWord();
    }
  } else {
    textEl.classList.add("miss");
    setTimeout(() => textEl.classList.remove("miss"), 100);
  }
}

function nextWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  index = 0;
  updateText();
}

function updateText() {
  const before = currentWord.slice(0, index);
  const current = currentWord[index] ?? "";
  const after = currentWord.slice(index + 1);

  textEl.innerHTML =
    `<span class="done">${before}</span>` +
    `<span class="current">${current}</span>` +
    after;
}
