import { texts, romaList } from "./data.js";

let textEl;

// 表示用
let displayText = "";
let kanaUnits = [];

// 入力状態
let kanaIndex = 0;
let romaIndex = 0;
let currentRomaCandidates = [];

export function initGame() {
  textEl = document.getElementById("text");
  nextText();
}

export function updateGame(key) {
  if (!kanaUnits.length) return;

  const current = kanaUnits[kanaIndex];
  const expectedChars = currentRomaCandidates.map(r => r[romaIndex]);

  // 今打ったキーが「どれかの候補の次の文字」に合っているか
  if (!expectedChars.includes(key)) {
    miss();
    return;
  }

  romaIndex++;

  // 候補を絞る
  currentRomaCandidates = currentRomaCandidates.filter(
    r => r[romaIndex - 1] === key
  );

  // ローマ字1つ完成した？
  const finished = currentRomaCandidates.find(r => r.length === romaIndex);
  if (finished) {
    kanaIndex++;
    romaIndex = 0;

    if (kanaIndex >= kanaUnits.length) {
      nextText();
      return;
    }

    currentRomaCandidates = kanaUnits[kanaIndex].romas;
  }

  updateText();
}

// ------------------------

function nextText() {
  const item = texts[Math.floor(Math.random() * texts.length)];
  displayText = item.display;

  kanaUnits = splitKana(item.internal);
  kanaIndex = 0;
  romaIndex = 0;
  currentRomaCandidates = kanaUnits[0].romas;

  updateText();
}

function splitKana(str) {
  const result = [];
  let i = 0;

  while (i < str.length) {
    const two = str.slice(i, i + 2);
    if (romaList[two]) {
      result.push({ kana: two, romas: romaList[two] });
      i += 2;
    } else {
      result.push({ kana: str[i], romas: romaList[str[i]] });
      i++;
    }
  }

  return result;
}

function updateText() {
  const done = kanaUnits.slice(0, kanaIndex).map(k => k.kana).join("");
  const current = kanaUnits[kanaIndex]?.kana ?? "";
  const rest = kanaUnits.slice(kanaIndex + 1).map(k => k.kana).join("");

  textEl.innerHTML =
    `<span class="done">${done}</span>` +
    `<span class="current">${current}</span>` +
    rest;
}

function miss() {
  textEl.classList.add("miss");
  setTimeout(() => textEl.classList.remove("miss"), 100);
}
