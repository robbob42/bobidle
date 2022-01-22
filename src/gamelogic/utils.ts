import Gameengine from './classes/GameEngine';
import Seed from './classes/Seed';
import GameResource from './classes/GameResource';


type pagesOpts = {
  name: string,
  icon: string,
  topNav?: {
    pages?: {
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

      // Lesson the red and blue values
      const darkener = (value) / 2;
      const brightenedValue = value - darkener;
      rgb[i] = brightenedValue;
  }

  const maxAry = [...rgb]
  const brightest = Math.max(...maxAry); // get the max of the array
  maxAry.splice(maxAry.indexOf(brightest), 1); // remove max from the array
  const second = Math.max(...maxAry); // get the 2nd max

  rgb.splice(rgb.indexOf(brightest), 1, brightest + ((255 - brightest) / 4));
  rgb.splice(rgb.indexOf(second), 1,  second + ((255 - second) / 4));

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// UI Utils
export function createNavigation(pages: pagesOpts) {
  const bottomNavLayout = document.createElement('div');
  const bottomNavDivider = document.createElement('cds-divider');
  const bottomNavContainer = document.createElement('div');

  bottomNavLayout.setAttribute('cds-layout','grid cols:auto gap:lg p-b:sm align:horizontal-stretch');
  bottomNavLayout.className = 'cds-horizontal-nav nav-bottom';

  for (const pageKey in pages) {
    bottomNavLayout.appendChild(addNavButton(pages[pageKey].name, pages[pageKey].icon));
  }

  bottomNavContainer.id = 'bottom-nav';
  bottomNavContainer.style.width = '100%';
  bottomNavContainer.style.display = '';
  bottomNavContainer.setAttribute('cds-layout','align:bottom');

  bottomNavContainer.appendChild(bottomNavDivider);
  bottomNavContainer.appendChild(bottomNavLayout);

  return bottomNavContainer;
}

export function addNavButton(name: string, icon: string) {
  const buttonIcon = document.createElement('cds-icon');
  const button = document.createElement('button');

  buttonIcon.setAttribute('shape', icon);
  buttonIcon.setAttribute('size', 'sm');

  button.addEventListener('click', () => navigate(name));
  button.id = `navigation-${name}`;
  button.appendChild(buttonIcon);

  return button;
}

export function navigate(pageName: string) {
  const navButton = document.getElementById(`navigation-${pageName}`);

  if (navButton) {
    // Highlight nav icon button
    const siblings = navButton.parentElement?.children;
    if (siblings) {
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].id === `navigation-${pageName}`) {
          siblings[i].setAttribute('active', 'true');
        } else {
          siblings[i].removeAttribute('active');
        }
      }
    }

    // Display content
    const pageContainer = document.getElementById('pages-container');
    if (pageContainer) {
      for (let i = 0; i < pageContainer.children.length; i++) {
        const page = pageContainer.children[i] as HTMLElement;
        if (pageContainer.children[i].id === pageName) {
          page.style.removeProperty('display');
        } else {
          page.style.display = 'none';
        }
      }
    }
  }
}

export function updateBasket(resource: GameResource) {
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
    // p.appendChild(seedBtn);
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