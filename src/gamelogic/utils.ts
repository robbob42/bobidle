import Gameengine from './classes/GameEngine';
import Seed from './classes/Seed';
import GameResource from './classes/GameResource';


export function calcIdleZombies(engine: Gameengine): number {
  return engine.resources.zombie.count - engine.resources.activezombie.count;
}

export function assignZombie(engine: Gameengine, jobName: string): void {
  engine.producers[jobName].incrementBy(1);
  engine.producers[jobName].processingEnabled = true;
  engine.resources.activezombie.incrementBy(1);
}

export function unassignZombie(engine: Gameengine, jobName: string): void {
  engine.producers[jobName].incrementBy(-1);
  engine.producers[jobName].processingEnabled = false;
  engine.resources.activezombie.incrementBy(-1);
}

export function convertHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600); // get hours
  const minutes = Math.floor((seconds - (hours * 3600)) / 60); // get minutes
  const sec = seconds - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  let str = '';
  if (hours > 0 && hours < 10) str += '0';
  if (hours > 0) str += hours.toString(10);

  if (minutes > 0) str += ':';
  if (minutes > 0 && minutes < 10) str += '0';
  if (minutes > 0) str += minutes.toString(10);

  str += ':';
  if (sec < 10) str += '0';
  if (sec >= 0) str += sec.toString(10);
  return str; // Return is HH : MM : SS
}

export function stringToColour(str: string) {
  // Returns string formatted 'rgb(0-256, 0-256, 0-256)'
  let hash = 0;
  if (str.length === 0) return str;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
  }
  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// UI Utils
export function createTabsDOM(tabs: {name: string, icon: string}[]) {
  const tabsSectionDiv = document.createElement('div');
  const tabsDiv = document.createElement('div');

  tabsSectionDiv.id = 'lower-half-tabs-section';
  tabsSectionDiv.setAttribute('cds-layout', 'vertical gap:md');
  tabsDiv.id = 'tabs';
  tabsDiv.setAttribute('cds-layout', 'horizontal gap:md align:top p:md');
  tabsDiv.style.height = '45px';

  for (const tabKey in tabs) {
    const tab = tabs[tabKey];
    addTab(tab.name, tab.icon, tabsDiv);
  }

  tabsSectionDiv.appendChild(tabsDiv);
  return tabsSectionDiv;
}

export function addTab(name: string, icon: string, parentDom: HTMLElement) {
  const onTabBtnClick = () => {
    selectTab(name);
  }

  const cdsButton = document.createElement('cds-placeholder');
  const vertDivider = document.createElement('cds-divider');
  const tabIcon = document.createElement('cds-icon');
  const iconButton = document.createElement('cds-icon-button');

  tabIcon.setAttribute('shape', icon);
  iconButton.setAttribute('action', 'flat');
  iconButton.setAttribute('aria-label', name.charAt(0).toUpperCase() + name.slice(1));
  iconButton.appendChild(tabIcon);
  iconButton.id = `tab-${name}`;
  iconButton.addEventListener('click', onTabBtnClick);
  iconButton.className = 'tab-button';
  cdsButton.appendChild(iconButton);
  vertDivider.setAttribute('orientation', 'vertical');

  parentDom.appendChild(cdsButton);
  parentDom.appendChild(vertDivider);
}

export function createTabContentDOM(tabs: {name: string, layout: string}[]) {
  const tabContentDiv = document.createElement('div');

  tabContentDiv.id = 'tab-content';
  tabContentDiv.setAttribute('cds-layout', 'vertical align:stretch');

  for (const tabKey in tabs) {
    const tab = tabs[tabKey];

    tabContentDiv.appendChild(createUniqueTabDOM(tab.name, tab.layout));
  }
  return tabContentDiv;
}

export function createUniqueTabDOM(name: string, layout: string) {
  const tabContentDiv = document.createElement('div');

  tabContentDiv.id = `tab-content-${name}`;
  tabContentDiv.className = 'tab-content';
  tabContentDiv.setAttribute('cds-layout', layout);
  tabContentDiv.style.display = 'none';

  return tabContentDiv;
}

export function selectTab(tabName: string) {
  const tabContent = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContent.length; i++) {
    if (tabContent[i].id === `tab-content-${tabName}`) {
      tabContent[i].setAttribute('style', 'display: grid');
    } else {
      tabContent[i].setAttribute('style', 'display: none');
    }
  }
}

export function updateInventory(seed: Seed) {
  const s = document.getElementById(`inventory-${seed.key}-count`);
  if (seed.count !== 0) {
    if (!s) {
      const i = document.getElementById('tab-content-inventory');
      const p = document.createElement('cds-placeholder');
      const seedBtn = seed.drawSeed();
      const sp = document.createElement('span');
      sp.id = `inventory-${seed.key}-count`;
      sp.innerHTML = `x ${seed.count}`;

      p.style.textAlign = 'center';
      p.appendChild(seedBtn);
      p.appendChild(document.createElement('br'));
      p.appendChild(sp);
      i?.appendChild(p);
    } else {
      s.innerHTML = `x ${seed.count}`;
    }
  } else {
    const parent = s?.parentElement;
    if (parent) parent.style.display = 'none';
  }
}

export function updateResources(resource: GameResource) {
  const s = document.getElementById(`resources-${resource.key}-count`);
  if (resource.count !== 0) {
    if (!s) {
      const i = document.getElementById('tab-content-resources');
      const p = document.createElement('cds-placeholder');
      const seedBtn = resource.drawResource();
      const sp = document.createElement('span');
      sp.id = `resources-${resource.key}-count`;
      sp.innerHTML = `x ${resource.count}`;

      p.style.textAlign = 'center';
      p.appendChild(seedBtn);
      p.appendChild(document.createElement('br'));
      p.appendChild(sp);
      i?.appendChild(p);
    } else {
      s.innerHTML = `x ${resource.count}`;
    }
  } else {
    const parent = s?.parentElement;
    if (parent) parent.style.display = 'none';
  }
}

export function updateMoneyDisplay(amt: number) {
  const moneyDisplay = document.getElementById('money-display') as HTMLElement;
  moneyDisplay.innerHTML = amt.toString(10);
}