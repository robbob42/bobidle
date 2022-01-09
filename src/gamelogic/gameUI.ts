import '@cds/core/alert/register.js';

import Gameengine from './classes/GameEngine';


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

    const seedOptions = {
      key: 'radish',
      engine: this.engine
    };
    const radishSeed = this.engine.createSeed(seedOptions);

    this.engine.gardens['baby'].plots['1'].plantSeed(radishSeed);
  }

  update() {
    // const now = Date.now();
  }

}