import '@cds/core/alert/register.js';
import '@cds/core/icon/register.js';
import { ClarityIcons, blockIcon } from '@cds/core/icon';

import Gameengine from './classes/GameEngine';
import Garden from './classes/Garden';
import { EmitPlanted } from './classes/Plot';
import { convertHMS } from './utils';


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

    const unselectButton = document.getElementById('unselect-button') as HTMLElement;
    unselectButton.addEventListener('click', () => this.engine.unselect());

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
        })

    }
    const seedOptions = {
      id: 1,
      entityType: 'resource',
      entityKey: 'radish',
      productionAmount: 1,
      productionTime: 20000,
      baseCost: {
        currency: 'gold',
        amount: 1
      },
      key: 'radish',
      engine: this.engine
    };
    const radishSeed = this.engine.createSeed(seedOptions);

    document.getElementById('feature-first-seed')?.appendChild(radishSeed.drawSeed());
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
        }
      }
    }
  }

}