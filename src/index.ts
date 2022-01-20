import Game from './gamelogic/game';

let game: Game;

function init() {
  // init
}

init();

window.onload = function () {
  game = new Game();
  gameLoop();
}

function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  game.onTick(Date.now());
}
