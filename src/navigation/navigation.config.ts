import gameTemplate from '../views/game.html';

export type NavItem = [label: string, viewParams: string, id: string];

const MAIN_CONTENT_SECTION = 'section-content';

export const navConfig: NavItem[] = [
  ['Game', gameTemplate, MAIN_CONTENT_SECTION],
];
