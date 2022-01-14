import { InitFeatureOpts } from './classes/Feature';
import { createTabsDOM, createTabContentDOM } from './utils';

// First Seed
const firstSeedDom = document.createElement('span');

// Lower Half
// Only Inventory
const tabs1DomOpts = [
  {
    name: 'inventory',
    icon: 'blocks-group'
  }
];
// Add Resource
const tabs2DomOpts = [
  ...tabs1DomOpts,
  {
    name: 'resources',
    icon: 'data-cluster'
  }
];
// Add Market
const tabs3DomOpts = [
  ...tabs2DomOpts,
  {
    name: 'market',
    icon: 'store'
  }
];
const tabsContentOpts = [
  {
    name: 'inventory',
    layout: 'grid cols:2 gap:md align:horizontal-center'
  },
  {
    name: 'resources',
    layout: 'grid cols:2 gap:md align:horizontal-center'
  },
  {
    name: 'market',
    layout: ''
  }
];
const tabsDiv = createTabsDOM(tabs1DomOpts);
const tabsContentDiv = createTabContentDOM(tabsContentOpts);
const horizDivider = document.createElement('cds-divider');
const lowerHalfDiv = document.createElement('div');

horizDivider.setAttribute('orientation', 'horizontal');
lowerHalfDiv.id = 'lower-half';
lowerHalfDiv.setAttribute('layout', 'true');
lowerHalfDiv.setAttribute('tall', 'true');
lowerHalfDiv.setAttribute('cds-layout', 'vertical gap:md align:top');
lowerHalfDiv.style.height = '50%';
lowerHalfDiv.appendChild(tabsDiv);
lowerHalfDiv.appendChild(horizDivider);
lowerHalfDiv.appendChild(tabsContentDiv);

// ResourceTab
const resourceTabsDiv = createTabsDOM(tabs2DomOpts);

// Money Display
const moneyIcon = document.createElement('cds-icon');
const moneyIconHolder = document.createElement('cds-placeholder');
const moneyHolder = document.createElement('cds-placeholder');
const moneyLayout = document.createElement('div');

moneyIcon.setAttribute('shape', 'coin-bag');
moneyIcon.setAttribute('size', 'md');
moneyIconHolder.setAttribute('cds-layout', 'horizontal gap:md align:vertical-center');
moneyHolder.id = 'money-display';
moneyHolder.className = 'coin-display';
moneyHolder.innerHTML = '1';
moneyLayout.setAttribute('cds-layout', 'horizontal gap:md p:sm align:right');

moneyIconHolder.appendChild(moneyIcon);
moneyLayout.appendChild(moneyIconHolder);
moneyLayout.appendChild(moneyHolder);

// Market
const marketTabsDiv = createTabsDOM(tabs3DomOpts);


type FeatureList = {
  [key: string]: InitFeatureOpts
}

export default {
  firstSeed: {
    key: 'firstseed',
    parentId: 'feature-first-seed',
    domElement: firstSeedDom,
    visible: true
  },
  lowerHalf: {
    key: 'lowerhalf',
    parentId: 'body-content',
    domElement: lowerHalfDiv,
    visible: false
  },
  resourceTab: {
    key: 'resourceTab',
    replaceId: 'lower-half-tabs-section',
    parentId: 'lower-half',
    domElement: resourceTabsDiv,
    visible: false
  },
  moneyDisplay: {
    key: 'moneyDisplay',
    firstChildId: 'garden-content',
    parentId: 'garden-content',
    domElement: moneyLayout,
    visible: false
  },
  marketTab: {
    key: 'marketTab',
    replaceId: 'lower-half-tabs-section',
    parentId: 'lower-half',
    domElement: marketTabsDiv,
    visible: false
  }
} as FeatureList