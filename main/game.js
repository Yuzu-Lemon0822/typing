import { texts, romaList } from "./data.js";

let jpEl;
let furiganaEl;
let romaEl;

// 表示用
let displayText = "";
let kanaUnits = [];

// 入力状態
let kanaIndex = 0;
let romaIndex = 0;
let currentRomaCandidates = [];

export function initGame() {
  jpEl = document.getElementById("jp-text");
  furiganaEl = document.getElementById("furigana");
  romaEl = document.getElementById("roma-text");
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

function buildKanaHTML() {
  const done = kanaUnits.slice(0, kanaIndex).map(k => k.kana).join("");
  const current = kanaUnits[kanaIndex]?.kana ?? "";
  const rest = kanaUnits.slice(kanaIndex + 1).map(k => k.kana).join("");

  return (
    `<span class="done">${done}</span>` +
    `<span class="current">${current}</span>` +
    `<span class="rest">${rest}</span>`
  );
}

function buildDisplayHTML() {
  let index = 0;
  let html = "";

  for (let i = 0; i < kanaUnits.length; i++) {
    const len = kanaUnits[i].kana.length;
    const part = displayText.slice(index, index + len);

    if (i < kanaIndex) {
      html += `<span class="done">${part}</span>`;
    } else if (i === kanaIndex) {
      html += `<span class="current">${part}</span>`;
    } else {
      html += `<span class="rest">${part}</span>`;
    }

    index += len;
  }

  return html;
}

function buildRomaHTML() {
  const doneRoma = kanaUnits
    .slice(0, kanaIndex)
    .map(k => k.romas[0])
    .join("");

  const currentRoma = currentRomaCandidates[0] ?? "";
  const doneLen = romaIndex;

  return (
    `<span class="done">${doneRoma + currentRoma.slice(0, doneLen)}</span>` +
    `<span class="current">${currentRoma[doneLen] ?? ""}</span>` +
    `<span class="rest">${currentRoma.slice(doneLen + 1)}</span>`
  );
}

function updateText() {
  furiganaEl.innerHTML = buildKanaHTML();
  jpEl.innerHTML = buildDisplayHTML();
  romaEl.innerHTML = buildRomaHTML();
}

function miss() {
  textEl.classList.add("miss");
  setTimeout(() => textEl.classList.remove("miss"), 100);
}
