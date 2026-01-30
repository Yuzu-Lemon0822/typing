import { setupInput } from "./main/input.js";
import { initGame, updateGame } from "./main/game.js";

initGame();

// 入力イベント → gameに渡す
setupInput((key) => {
  updateGame(key);
});

// ループ（今は空でOK）
function loop() {
  requestAnimationFrame(loop);
}
loop();
