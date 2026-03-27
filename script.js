// script.js - substitui textos por palavras aleatórias

const WORDS = [
  "banana","sol","cachorro","relógio","nuvem",
  "foguete","papel","mar","estrela","carro",
  "girassol","abacaxi","montanha","chocolate","borboleta",
  "computador","rio","floresta","janela","sorriso"
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function randomPhrase(min = 1, max = 4) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  let parts = [];
  for (let i = 0; i < count; i++) parts.push(randomWord());
  return parts.join(" ");
}

function shouldSkipNode(node) {
  if (!node) return true;
  if (node.nodeType !== Node.TEXT_NODE) return true;
  const parent = node.parentElement;
  if (!parent) return true;
  const tag = parent.tagName.toLowerCase();
  const skipTags = ["script","style","textarea","input","select","button"];
  if (skipTags.includes(tag)) return true;
  if (parent.isContentEditable) return true;
  const text = node.nodeValue.trim();
  if (!text) return true;
  return false;
}

function replaceTextNodes(root = document.body) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;
  const toReplace = [];
  while (node = walker.nextNode()) {
    if (!shouldSkipNode(node)) toReplace.push(node);
  }
  toReplace.forEach(textNode => {
    // mantém comprimento aproximado para evitar quebras visuais extremas
    const original = textNode.nodeValue.trim();
    const wordsCount = Math.max(1, Math.min(6, original.split(/\s+/).length));
    const phrase = Array.from({length: wordsCount}, () => randomWord()).join(" ");
    textNode.nodeValue = textNode.nodeValue.replace(original, phrase);
  });
}

function addRandomizeButton() {
  if (document.getElementById("randomize-words-btn")) return;
  const btn = document.createElement("button");
  btn.id = "randomize-words-btn";
  btn.textContent = "Trocar Palavras Aleatórias";
  btn.style.position = "fixed";
  btn.style.right = "12px";
  btn.style.bottom = "12px";
  btn.style.zIndex = 9999;
  btn.style.padding = "8px 12px";
  btn.style.borderRadius = "6px";
  btn.style.background = "#222";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.addEventListener("click", () => replaceTextNodes());
  document.body.appendChild(btn);
}

document.addEventListener("DOMContentLoaded", () => {
  replaceTextNodes();
  addRandomizeButton();
});
