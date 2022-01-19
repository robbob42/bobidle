import Gameengine from './classes/GameEngine';
import Seed from './classes/Seed';
import GameResource from './classes/GameResource';


type tabDOMOpts = {
  name: string,
  icon?: string,
  group?: {
    groupId: string,
    navStartId: string,
    groupIcon: string,
    tabs?: {
      name: string,
      icon: string
    }[]
  }
}[]

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
export function createTabsDOM(tabs: tabDOMOpts) {
  const pMenu = document.createElement('p');
  const subDiv = document.createElement('div');
  const divider = document.createElement('cds-divider');
  const subStart = document.createElement('div');
  const cdsNavClone = document.getElementById('cds-navigation') as HTMLElement;
  const cdsNav = cdsNavClone.cloneNode() as HTMLElement;

  pMenu.innerHTML = 'Menu';
  subDiv.style.backgroundColor = 'var(--cds-global-color-construction-900)';
  subDiv.style.color = 'var(--cds-global-color-gray-0)';
  subDiv.appendChild(pMenu);
  divider.setAttribute('cds-layout', 'm-y:md');
  subStart.setAttribute('slot', 'cds-navigation-substart');
  subStart.appendChild(subDiv);
  subStart.appendChild(divider);
  cdsNav.style.display = '';
  cdsNav.setAttribute('role', 'list');
  cdsNav.id = 'navigation';
  cdsNav.style.setProperty('--background', 'var(--cds-global-color-construction-900)')
  cdsNav.appendChild(subStart);

  for (const tabKey in tabs) {
    const tab = tabs[tabKey];
    let newTab = document.createElement('div') as HTMLElement;
    if (tab.group) {
      const navGroupIcon = document.createElement('cds-icon');
      const navGroupStart = document.createElement('cds-navigation-start');
      newTab = document.createElement('cds-navigation-group');

      navGroupIcon.setAttribute('shape', tab.group.groupIcon);
      navGroupIcon.setAttribute('size','sm');
      navGroupStart.id = tab.group.navStartId;
      navGroupStart.style.setProperty('--background','var(--cds-global-color-construction-900)');
      navGroupStart.style.setProperty('--color','var(--cds-global-color-gray-0)');
      navGroupStart.innerHTML = tab.name;
      navGroupStart.appendChild(navGroupIcon);
      newTab.id = tab.group.groupId;
      newTab.appendChild(navGroupStart);

      if (tab.group.tabs) {
        for (const groupKey in tab.group.tabs) {
          const groupTab = tab.group.tabs[groupKey];
          const newGroupTab = addTab(groupTab.name, groupTab.icon);

          newTab.appendChild(newGroupTab);
        }
      }
    } else if (tab.icon) {
      newTab = addTab(tab.name, tab.icon);
    }

    cdsNav.appendChild(newTab);
  }

  return cdsNav;
}

export function addTab(name: string, icon: string): HTMLElement {
  const cdsIcon = document.createElement('cds-icon');
  const navA = document.createElement('a');
  const navItemClone = document.getElementById('cds-navigation-item') as HTMLElement;
  const navItem = navItemClone.cloneNode() as HTMLElement;
  const badge = document.createElement('cds-badge');

  const onTabBtnClick = () => {
    selectTab(name);
  }

  cdsIcon.setAttribute('shape', icon);
  cdsIcon.setAttribute('size', 'sm');
  navA.innerHTML = name;
  navA.setAttribute('href', '#');
  navA.appendChild(cdsIcon);
  badge.id = `navigation-${name}-badge`;
  badge.innerHTML = '1';
  badge.style.position = 'relative';
  badge.style.left = '-6px';
  badge.setAttribute('color', 'gray');
  // badge.style.display = 'none';
  navItem.style.display = '';
  navItem.style.setProperty('--background', 'var(--cds-global-color-construction-900)');
  navItem.style.setProperty('--color', 'var(--cds-global-color-gray-0)');
  navItem.id = `navigation-item-${name}`;
  navItem.appendChild(navA);
  navItem.appendChild(badge);
  navItem.addEventListener('click', onTabBtnClick);

  return navItem;
}

export function createTabContentDOM(tabs: {name: string, display: string, layout: string}[]) {
  const tabContentDiv = document.createElement('div');

  tabContentDiv.id = 'tab-content';
  tabContentDiv.setAttribute('cds-layout', 'vertical');

  for (const tabKey in tabs) {
    const tab = tabs[tabKey];

    tabContentDiv.appendChild(createUniqueTabDOM(tab.name, tab.display, tab.layout));
  }
  return tabContentDiv;
}

export function createUniqueTabDOM(name: string, display: string, layout: string) {
  const cdsPlaceholder = document.createElement('cds-placeholder');
  const divider = document.createElement('cds-divider');
  const section = document.createElement('section');

  divider.setAttribute('orientation', 'horizontal');
  divider.setAttribute('cds-layout', 'col:12');
  cdsPlaceholder.setAttribute('cds-layout', 'col:12');
  cdsPlaceholder.innerHTML = display;
  section.id = `tab-content-${name}`;
  section.style.display = 'none';
  section.setAttribute('cds-layout', layout);
  section.appendChild(cdsPlaceholder);
  section.appendChild(divider);

  return section;
}

export function selectTab(tabName: string) {
  const tabContent = document.getElementById('tab-content') as HTMLElement;
  const navIcons = document.getElementById('navigation') as HTMLElement;
  const tabs = tabContent.children;
  const navIconsChildren = navIcons.children;

  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].id === `tab-content-${tabName}`) {
      tabs[i].setAttribute('style', 'display: grid');
    } else {
      tabs[i].setAttribute('style', 'display: none');
    }
  }

  for (let i = 0; i < navIconsChildren.length; i++) {
    if (navIconsChildren[i].id === `navigation-item-${tabName}`) {
      navIconsChildren[i].setAttribute('active', 'true');
    } else {
      navIconsChildren[i].removeAttribute('active');
    }

    // Loop through sub groups
    if (navIconsChildren[i].id.includes('group')) {
      const groupChildren = navIconsChildren[i].children;
      for (let j = 0; j < groupChildren.length; j++) {
        if (groupChildren[j].id === `navigation-item-${tabName}`) {
          groupChildren[j].setAttribute('active', 'true');
          navIconsChildren[i].setAttribute('expanded', 'true');
        } else {
          groupChildren[j].removeAttribute('active');
        }
      }
    }
  }
}

export function updateInventory(seed: Seed) {
  const s = document.getElementById(`inventory-${seed.key}-count`);
  if (seed.count !== 0) {
    if (!s) {
      const i = document.getElementById('tab-content-inventory');
      const p = document.createElement('cds-placeholder');
      const seedBtn = seed.drawSeed('inventory');
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

      const parent = s?.parentElement;
      if (parent) parent.style.display = '';
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
      const seedBtn = resource.drawResource('resources');
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

      const parent = s?.parentElement;
      if (parent) parent.style.display = '';
    }
  } else {
    const parent = s?.parentElement;
    if (parent) parent.style.display = 'none';
  }
}

export function updateMarketBuy(seed: Seed) {
  const s = document.getElementById(`buy-${seed.key}-count`);

  if (!s) {
    const i = document.getElementById('tab-content-buy');
    const p = document.createElement('cds-placeholder');
    const seedBtn = seed.drawSeed('market');

    p.style.textAlign = 'center';
    p.appendChild(seedBtn);
    i?.appendChild(p);
  } else {
    s.innerHTML = `x ${seed.count}`;
  }
}

export function updateMarketSell(resource: GameResource) {
  const s = document.getElementById(`sell-${resource.key}-count`);
  if (resource.count !== 0) {
    if (!s) {
      const i = document.getElementById('tab-content-sell');
      const p = document.createElement('cds-placeholder');
      const seedBtn = resource.drawResource('market');
      const sp = document.createElement('span');
      sp.id = `sell-${resource.key}-count`;
      sp.innerHTML = `x ${resource.count}`;

      p.style.textAlign = 'center';
      p.appendChild(seedBtn);
      p.appendChild(document.createElement('br'));
      p.appendChild(sp);
      i?.appendChild(p);
    } else {
      s.innerHTML = `x ${resource.count}`;

      const parent = s?.parentElement;
      if (parent) parent.style.display = '';
    }
  } else {
    const parent = s?.parentElement;
    if (parent) parent.style.display = 'none';
  }
}

export function updateMoneyDisplay(amt?: number, engine?: Gameengine) {
  const moneyDisplay = document.getElementById('money-display') as HTMLElement;

  if (amt) {
    moneyDisplay.innerHTML = amt.toString(10);
  } else if (engine) {
    moneyDisplay.innerHTML = engine.currencies['coin'].value.toString();
  }
}