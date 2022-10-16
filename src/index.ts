/**
 * Lifted straight out of the Continuum-engine example page.
 * This instantiates the Game object, and then recursively calls the game.onTick() method forever.
 */

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
