import { makeNavView } from './navigation/navigation';
import { renderHtmlTemplate } from './navigation/utils';
import homeTemplate from './views/home.html';
import Game from './gamelogic/game';

let game: Game;

function init() {
  const navSection = document.getElementById('section-nav');
  const navView = makeNavView();
  navSection?.appendChild(navView);
  renderHtmlTemplate(homeTemplate, 'section-content');
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
