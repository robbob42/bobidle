import UI from "./gameUI";
import gardenList from './gardens';
import featureList from './features';
import seedList from './seeds';
import resourceList from './resources';
import Gameengine from './classes/GameEngine';


export default class Game {
  engine;
  ui;

  constructor() {
    this.engine = new Gameengine();
    this.ui = new UI(this.engine);

    this.initEngine();
  }

  initEngine() {
    // create Producers, Resources, modifiers, reactors etc
    this.engine.createCurrency("coin", 0);

    this.createGardens();
    this.createFeatures();
    this.createResources();
    this.createSeeds();

    this.ui.init();
  }

  createGardens() {
    for (const garden in gardenList) {
      this.engine.createGarden(gardenList[garden]);
    }
  }

  createFeatures() {
    for (const feature in featureList) {
      this.engine.createFeature(featureList[feature]);
    }
  }

  createSeeds() {
    for (const seed in seedList) {
      this.engine.createSeed(seedList[seed]);
    }
  }

  createResources() {
    for (const resource in resourceList) {
      this.engine.createGameResource(resourceList[resource]);
    }
  }

  onTick(dt: number) {
    this.engine.onTick(dt);
    this.ui.update();
  }
}