import UI from "./gameUI";
import gardenList from './gardens';
import featureList from './features';
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
    this.engine.createCurrency({currency: "gold", amount: 300});

    this.createGardens();
    this.createFeatures();

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

  onTick(dt: number) {
    this.engine.onTick(dt);
    this.ui.update();
  }
}