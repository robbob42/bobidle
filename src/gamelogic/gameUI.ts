import '@cds/core/card/register.js';
import '@cds/core/icon/register.js';
import '@cds/core/divider/register.js';
import '@cds/core/navigation/register.js';
import '@cds/core/badge/register.js';
import { ClarityIcons, blockIcon, blocksGroupIcon, dataClusterIcon,
          coinBagIcon, storeIcon, shoppingCartIcon, dollarBillIcon,
          homeIcon, bookIcon, clipboardIcon, treeIcon } from '@cds/core/icon';

import Gameengine from './classes/GameEngine';
import Garden from './classes/Garden';
import { EmitPlanted, EmitHarvested } from './classes/Plot';
import { convertHMS, selectTab, updateInventory, updateResources,
          updateMoneyDisplay, updateMarketSell, updateMarketBuy } from './utils';
import { EmitFeatureUnlocked } from './classes/Feature';


export default class gameUI {
  engine;
  gardenElem;
  activeGarden: Garden | undefined;

  constructor(engine: Gameengine) {
    this.engine = engine;
    this.gardenElem = document.getElementById("garden") as HTMLElement;
  }

  init() {
    ClarityIcons.addIcons(blockIcon);
    ClarityIcons.addIcons(blocksGroupIcon);
    ClarityIcons.addIcons(dataClusterIcon);
    ClarityIcons.addIcons(coinBagIcon);
    ClarityIcons.addIcons(storeIcon);
    ClarityIcons.addIcons(shoppingCartIcon);
    ClarityIcons.addIcons(dollarBillIcon);
    ClarityIcons.addIcons(homeIcon);
    ClarityIcons.addIcons(bookIcon);
    ClarityIcons.addIcons(clipboardIcon);
    ClarityIcons.addIcons(treeIcon);

    const unselectButton = document.getElementById('unselect-button');
    unselectButton?.addEventListener('click', () => this.engine.unselect());

    this.activeGarden = this.engine.activeGarden();
    this.gardenElem.appendChild(this.activeGarden.drawGarden());

    for (const feature in this.engine.features) {
      if (this.engine.features[feature].visible) {
        const parent = document.getElementById(this.engine.features[feature].parentId) as HTMLElement;
        parent.appendChild(this.engine.features[feature].domElement);
      }
    }

    for (const plot in this.activeGarden.plots) {
      this.activeGarden.plots[plot]
        .on('SEED_PLANTED', (opts: EmitPlanted) => {
          const firstSeedDom = document.getElementById('feature-first-seed');
          if (firstSeedDom) firstSeedDom.style.display = 'none';

          // Display seed to DOM
          const plotSpan = document.getElementById(`plot-${opts.plot.key}-highlight`) as HTMLElement;
          plotSpan.style.backgroundColor = '#DDDDDD';
          plotSpan.style.color = opts.seed.color;
          plotSpan.innerHTML = '.';

          // Display counter to DOM
          const domElement = document.getElementById(`plot-${opts.plot.key}`) as HTMLElement;
          const parent = domElement.parentElement as HTMLElement;

          const d = document.createElement('div');
          d.setAttribute('cds-layout', 'container:center col:12');
          d.id = `plot-${opts.plot.key}-counter`;
          parent.appendChild(d);

          // Hide timer placeholder
          const placeholder = document.getElementById(`plot-${opts.plot.key}-timerspacer`) as HTMLElement;
          placeholder.style.display = 'none';

          // Update inventory
          updateInventory(opts.seed);
        })
      this.activeGarden.plots[plot]
        .on('SEED_HARVESTED', (opts: EmitHarvested) => {
          // Display seed to DOM
          const plotSpan = document.getElementById(`plot-${opts.plot.key}-highlight`) as HTMLElement;
          plotSpan.style.backgroundColor = '#FFFFFF';
          plotSpan.innerHTML = '';

          // Remove counter from DOM
          const domElement = document.getElementById(`plot-${opts.plot.key}`) as HTMLElement;
          const parent = domElement.parentElement as HTMLElement;
          const timer = parent.lastElementChild as HTMLElement;
          parent.removeChild(timer);

          // Show timer placeholder
          const placeholder = document.getElementById(`plot-${opts.plot.key}-timerspacer`) as HTMLElement;
          placeholder.style.display = '';

          // Update inventory for the seed, and any of its children seed
          updateInventory(opts.seed);
          if (opts.seed.outputs.seeds) {
            for (const seedKey in opts.seed.outputs.seeds) {
              updateInventory(this.engine.seeds[seedKey]);
            }
          }
          if (opts.seed.outputs.resources) {
            for (const resourceKey in opts.seed.outputs.resources) {
              updateResources(this.engine.resources[resourceKey]);
              updateMarketSell(this.engine.resources[resourceKey]);
            }
          }
          if (opts.seed.outputs.currencies) {
            for (const resourceKey in opts.seed.outputs.currencies) {
              updateMoneyDisplay(this.engine.currencies[resourceKey].value);
            }
          }
        })
    }

    for(const featureKey in this.engine.features) {
      this.engine.features[featureKey]
        .on('FEATURE_UNLOCKED', (opts: EmitFeatureUnlocked) => {
          const parent = document.getElementById(opts.feature.parentId) as HTMLElement;
          if (opts.feature.firstChildId) {
            const parent = document.getElementById(opts.feature.parentId) as HTMLElement;
            parent.insertBefore(opts.feature.domElement, parent.firstChild);
          } else if (opts.feature.replaceId) {
            const replaceElement = document.getElementById(opts.feature.replaceId) as HTMLElement;
            parent.replaceChild(opts.feature.domElement, replaceElement);
          } else {
            parent.appendChild(opts.feature.domElement);
          }

          // Update Inventory in case the inventory was just unlocked
          if (opts.feature.key === 'lowerHalf') {
            selectTab('inventory');
          }

          if (opts.feature.key === 'resourceTab') {
            selectTab('resources');
          }

          if (opts.feature.key === 'marketBuyTab' || opts.feature.key === 'marketSellTab') {
            const marketClick = () => {
              const marketNav = document.getElementById('market-group');
              if (marketNav?.getAttribute('expanded') === 'true') {
                marketNav?.setAttribute('expanded', 'false');
              } else {
                marketNav?.setAttribute('expanded', 'true');
              }
            }
            const market = document.getElementById('market');
            market?.addEventListener('click', marketClick);
          }

          if (opts.feature.key === 'marketBuyTab') {
            for (const seedKey in this.engine.seeds) {
              const seed = this.engine.seeds[seedKey];

              if (seed.baseCost) {
                updateMarketBuy(seed);
              }
            }

            selectTab('buy');
          }

          if (opts.feature.key === 'marketSellTab') {
            for (const resourceKey in this.engine.resources) {
              const resource = this.engine.resources[resourceKey];

              if (resource.basePrice) {
                updateMarketSell(resource);
              }
            }
            selectTab('sell');
          }

          for (const seedKey in this.engine.seeds) {
            const seed = this.engine.seeds[seedKey];
            updateInventory(seed);
          }
        });
    }

    document.getElementById('feature-first-seed')?.appendChild(this.engine.seeds['InventoryTab'].drawSeed('inventory'));
  }

  update() {
    // 'for' loop in charge of seed icons and timer updates
    for (const plotKey in this.activeGarden?.plots) {
      const plot = this.activeGarden?.plots[plotKey];

      // Only run inner checks on plots with active seeds
      if (plot && this.activeGarden && plot.endTime >= Date.now()) {

        // The 'update()' function runs ~60 times per second, so limit it to only make DOM updates once per second
        if (plot.calculateSecondsRemaining() !== plot.timeRemaining) {
          // currentPct: float between 0 - 1
          const currentPct = plot.calculatePctComplete();
          const counterElem = document.getElementById(`plot-${plot.key}-counter`) as HTMLElement;
          const currentIconElem = document.getElementById(`plot-${plot.key}-highlight`) as HTMLElement;
          const seed = plot.seed;

          // Update DOM seed:
          //  At 50% completion, change from baby seed character to medium seed character
          if (currentPct < .50 && currentIconElem.innerHTML !== '.') {
            currentIconElem.innerHTML = '.';
          } else if (seed && currentPct >= .50 && currentPct < 1 && currentIconElem.innerHTML !== seed.key.charAt(0).toLowerCase()) {
            currentIconElem.innerHTML = seed.key.charAt(0).toLowerCase();
          }

          // Decrement timeRemaining
          plot.timeRemaining = plot.timeRemaining - 1;

          // Update DOM timer
          counterElem.innerHTML = convertHMS(plot.timeRemaining);
        }

        // Because of the parent 'if' statement, this block will only get run once, on the final passthrough
        if (plot.timeRemaining === 0) {
          const currentIcon = document.getElementById(`plot-${plot.key}-highlight`) as HTMLElement;
          const seed = plot.seed;
          const counterElem = document.getElementById(`plot-${plot.key}-counter`) as HTMLElement;

          // At 100% completion, change to adult seed character
          if (seed) currentIcon.innerHTML = seed.key.charAt(0).toUpperCase();

          // Reset counters
          plot.endTime = 0;
          plot.beginTime = 0;

          // Update DOM timer
          counterElem.innerHTML = convertHMS(plot.timeRemaining);


          // this.engine.features['lowerhalf'].unlockFeature();
        }
      }
    }
  }

}