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
  }

  update() {
    // const now = Date.now();
  }

}