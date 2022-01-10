import '@cds/core/alert/register.js';

import Gameengine from './classes/GameEngine';
import { EmitPlanted } from './classes/Plot';
import { convertHMS } from './utils';


export default class gameUI {
  engine;
  gardenElem;

  constructor(engine: Gameengine) {
    this.engine = engine;
    this.gardenElem = document.getElementById("garden") as HTMLElement;
  }

  init() {
    const currentGarden = this.engine.activeGarden();
    this.gardenElem.appendChild(currentGarden.drawGarden());

    for (const feature in this.engine.features) {
      if (this.engine.features[feature].visible) {
        const parent = document.getElementById(this.engine.features[feature].parentId) as HTMLElement;
        parent.appendChild(this.engine.features[feature].domElement);
      }
    }

    this.engine.gardens['baby'].plots['1']
      .on('SEED_PLANTED', (opts: EmitPlanted) => {
        const firstSeedDom = document.getElementById('feature-first-seed');
        if (firstSeedDom) firstSeedDom.style.display = 'none';

        opts.plot.beginTime = Date.now();
        opts.plot.endTime = Date.now() + opts.seed.productionTime;
        opts.plot.timeRemaining = opts.seed.productionTime / 1000;

        // Display seed to DOM
        const plotSpan = document.getElementById(`plot-${opts.plot.key}-highlight`) as HTMLElement;
        plotSpan.style.backgroundColor = '#DDDDDD';
        plotSpan.style.color = opts.seed.color;
        plotSpan.innerHTML = '.';

        // Display counter to DOM
        opts.plot.enableCounter();
      })

    const seedOptions = {
      id: 1,
      entityType: 'resource',
      entityKey: 'radish',
      productionAmount: 1,
      productionTime: 10000,
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
    if (this.engine.gardens['baby'].plots['1'].endTime >= Date.now()) {
      if (Math.floor((this.engine.gardens['baby'].plots['1'].endTime - Date.now()) / 1000) !== this.engine.gardens['baby'].plots['1'].timeRemaining) {
        const totalTime = this.engine.gardens['baby'].plots['1'].endTime - this.engine.gardens['baby'].plots['1'].beginTime;
        const currentTime = Date.now() - this.engine.gardens['baby'].plots['1'].beginTime;
        const currentPct = currentTime / totalTime;

        const currentIcon = document.getElementById('plot-1-highlight') as HTMLElement;
        const seed = this.engine.gardens['baby'].plots['1'].seed;

        if (currentPct < .50 && currentIcon.innerHTML !== '.') {
          currentIcon.innerHTML = '.';
        } else if (seed && currentPct >= .50 && currentPct < 1 && currentIcon.innerHTML !== seed.key.charAt(0).toLowerCase()) {
          currentIcon.innerHTML = seed.key.charAt(0).toLowerCase();
        }

        this.engine.gardens['baby'].plots['1'].timeRemaining = this.engine.gardens['baby'].plots['1'].timeRemaining - 1;

        const counter = document.getElementById('plot-1-counter') as HTMLElement;
        counter.innerHTML = convertHMS(this.engine.gardens['baby'].plots['1'].timeRemaining);
      }
      if (this.engine.gardens['baby'].plots['1'].timeRemaining === 0) {
        const currentIcon = document.getElementById('plot-1-highlight') as HTMLElement;
        const seed = this.engine.gardens['baby'].plots['1'].seed;
        if (seed) currentIcon.innerHTML = seed.key.charAt(0).toUpperCase();
        this.engine.gardens['baby'].plots['1'].endTime = 0;
        this.engine.gardens['baby'].plots['1'].beginTime = 0;
      }
    }
  }

}