import { renderHtmlTemplate } from './navigation/utils';
import gameTemplate from './views/game.html';
import Game from './gamelogic/game';

let game: Game;

function init() {
  // Navigation
  // const navSection = document.getElementById('section-nav') as HTMLElement;
  // const navView = makeNavView();
  // navSection.appendChild(navView);
  renderHtmlTemplate(gameTemplate, 'section-content');
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
