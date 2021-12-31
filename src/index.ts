import { makeNavView } from './navigation/navigation';
import { renderHtmlTemplate } from './navigation/utils';
import homeTemplate from './views/home.html';

function init() {
  const navSection = document.getElementById('section-nav');
  const navView = makeNavView();
  navSection?.appendChild(navView);
  renderHtmlTemplate(homeTemplate, 'section-content');
}

init();
