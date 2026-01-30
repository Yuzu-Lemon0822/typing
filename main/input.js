export function setupInput(onKeyPress) {
  document.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    onKeyPress(e.key);
  });
}
