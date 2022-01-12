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
const tabsContentOpts = [
  {
    name: 'inventory',
    layout: 'grid cols:2 gap:md align:horizontal-center'
  },
  {
    name: 'resources',
    layout: 'grid cols:2 gap:md align:horizontal-center'
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
  }
} as FeatureList