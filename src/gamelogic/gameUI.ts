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
import { convertHMS, navigate, updateMoneyDisplay, updateMarketSell } from './utils';


export default class gameUI {
  /**
   * Handle the initialization of all UI elements, including Clarity icons that will be used throughout the application,
   * and event listeners that need to be created when the game is first started.
   *
   * @param engine - An instance of the Continuum Game Engine
   */

  engine;
  gardenElem;
  activeGarden: Garden | undefined;

  constructor(engine: Gameengine) {
    this.engine = engine;
    this.gardenElem = document.getElementById("garden") as HTMLElement;
  }

  init() {
    // All necessary Clarity icons imported below
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

    // Attach Continuum Event Listeners to the plot
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

          // Set HARVEST button to disabled
          const plotHarvestButton = document.getElementById(`${opts.plot.key}-harvest`) as HTMLElement;
          plotHarvestButton.setAttribute('disabled', 'true');
          navigate('home');
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

          if (opts.seed.outputs.resources) {
            for (const resourceKey in opts.seed.outputs.resources) {
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

    this.engine.seeds['navigation'].drawSeed('feature-first-seed');
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