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
    group: {
      groupId: 'market-group',
      navStartId: 'market',
      groupIcon: 'store'
    }
  }
];
// Add Market Buy
const tabs4DomOpts = [
  ...tabs2DomOpts,
  {
    name: 'market',
    group: {
      groupId: 'market-group',
      navStartId: 'market',
      groupIcon: 'store',
      tabs: [
        {
          name: 'buy',
          icon: 'shopping-cart'
        }
      ]
    }
  }
];
// Add Market Sell
const tabs5DomOpts = [
  ...tabs2DomOpts,
  {
    name: 'market',
    group: {
      groupId: 'market-group',
      navStartId: 'market',
      groupIcon: 'store',
      tabs: [
        {
          name: 'buy',
          icon: 'shopping-cart'
        },
        {
          name: 'sell',
          icon: 'dollar-bill'
        }
      ]
    }
  }
];
const tabsContentOpts = [
  {
    name: 'inventory',
    display: 'Seeds',
    layout: 'grid cols:2 gap:lg p:lg align:horizontal-center'
  },
  {
    name: 'resources',
    display: 'Produce',
    layout: 'grid cols:2 gap:lg p:lg align:horizontal-center'
  },
  {
    name: 'market',
    display: 'Market',
    layout: 'grid cols:2 gap:lg p:lg align:horizontal-center'
  },
  {
    name: 'buy',
    display: 'Buy',
    layout: 'grid cols:2 gap:lg p:lg align:horizontal-center'
  },
  {
    name: 'sell',
    display: 'Sell',
    layout: 'grid cols:2 gap:lg p:lg align:horizontal-center'
  }
];
const tabsDiv = createTabsDOM(tabs1DomOpts);
const tabsContentDiv = createTabContentDOM(tabsContentOpts);
const horizDivider = document.createElement('cds-divider');
const lowerHalfDiv = document.createElement('div');
const lowerHalfWrapper = document.createElement('div');

lowerHalfDiv.id = 'lower-half';
lowerHalfDiv.setAttribute('layout', 'true');
lowerHalfDiv.setAttribute('tall', 'true');
lowerHalfDiv.setAttribute('cds-layout', 'horizontal wrap:none align:stretch');
lowerHalfDiv.appendChild(tabsDiv);
lowerHalfDiv.appendChild(tabsContentDiv);
horizDivider.setAttribute('orientation', 'horizontal');
horizDivider.className = 'body-divider';
horizDivider.setAttribute('cds-layout', 'align:shrink');
lowerHalfWrapper.id = 'lower-half-wrapper';
lowerHalfWrapper.setAttribute('cds-layout', 'vertical wrap:none align:stretch');
lowerHalfWrapper.appendChild(horizDivider);
lowerHalfWrapper.appendChild(lowerHalfDiv);

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

// Market
const marketBuyTabsDiv = createTabsDOM(tabs4DomOpts);

// Market
const marketSellTabsDiv = createTabsDOM(tabs5DomOpts);


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
    domElement: lowerHalfWrapper,
    visible: false
  },
  resourceTab: {
    key: 'resourceTab',
    replaceId: 'navigation',
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
    replaceId: 'navigation',
    parentId: 'lower-half',
    domElement: marketTabsDiv,
    visible: false
  },
  marketBuyTab: {
    key: 'marketBuyTab',
    replaceId: 'navigation',
    parentId: 'lower-half',
    domElement: marketBuyTabsDiv,
    visible: false
  },
  marketSellTab: {
    key: 'marketSellTab',
    replaceId: 'navigation',
    parentId: 'lower-half',
    domElement: marketSellTabsDiv,
    visible: false
  }
} as FeatureList