import { InitFeatureOpts } from './classes/Feature';
import { createNavigation, createMarketNavigationButton } from './utils';

// First Seed
const firstSeedDom = document.createElement('span');

// Lower Half
// Only Inventory
const tabs1DomOpts = [
  {
    name: 'home',
    icon: 'home'
  },
  {
    name: 'inventory',
    icon: 'blocks-group'
  }
];
// Add Basket
const tabs2DomOpts = [
  ...tabs1DomOpts,
  {
    name: 'basket',
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
// Add Market Buy
const marketTabs1DomOpts = {
  name: 'market-buy',
  icon: 'shopping-cart'
};

// Add Market Sell
const marketTabs2DomOpts = {
  name: 'market-sell',
  icon: 'dollar-bill'
};

const bottomNavigation = createNavigation(tabs1DomOpts);
// const tabsContentDiv = createTabContentDOM(tabsContentOpts);

// ResourceTab
const basket = createNavigation(tabs2DomOpts);

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
moneyHolder.innerHTML = '0';
moneyLayout.setAttribute('cds-layout', 'horizontal gap:md p:sm align:right');

moneyIconHolder.appendChild(moneyIcon);
moneyLayout.appendChild(moneyIconHolder);
moneyLayout.appendChild(moneyHolder);

// Market
const market = createNavigation(tabs3DomOpts);

// Market - Buy
const marketBuyTabsDiv = createMarketNavigationButton(marketTabs1DomOpts);

// Market
const marketSellTabsDiv = createMarketNavigationButton(marketTabs2DomOpts);


type FeatureList = {
  [key: string]: InitFeatureOpts
}

export default {
  firstSeed: {
    key: 'firstseed',
    display: 'First Seed',
    parentId: 'feature-first-seed',
    domElement: firstSeedDom,
    visible: true
  },
  navigation: {
    key: 'navigation',
    display: 'Bottom Navigation Bar',
    parentId: 'container',
    domElement: bottomNavigation,
    visible: false
  },
  basket: {
    key: 'basket',
    display: 'Basket',
    replaceId: 'bottom-nav',
    parentId: 'container',
    domElement: basket,
    visible: false
  },
  bank: {
    key: 'bank',
    display: 'Bank',
    firstChildId: 'garden',
    parentId: 'garden',
    domElement: moneyLayout,
    visible: false
  },
  market: {
    key: 'market',
    display: 'Market',
    replaceId: 'bottom-nav',
    parentId: 'container',
    domElement: market,
    visible: false
  },
  marketBuyTab: {
    key: 'marketBuyTab',
    display: 'Market - Buy',
    parentId: 'market-nav',
    domElement: marketBuyTabsDiv,
    visible: false
  },
  marketSellTab: {
    key: 'marketSellTab',
    display: 'Market - Sell',
    parentId: 'market-nav',
    domElement: marketSellTabsDiv,
    visible: false
  }
} as FeatureList