import homeTemplate from '../views/home.html';

export type NavItem = [label: string, viewParams: string, id: string];

const MAIN_CONTENT_SECTION = 'section-content';

export const navConfig: NavItem[] = [
  ['Game', homeTemplate, MAIN_CONTENT_SECTION],
];
