import ContinuumEngine from '../../vendor/continuum/engine';
import UI from "./ui";
import resourceList from "./resources";
import producerList from "./producers"

export default class Game {
  engine;
  ui;

  constructor() {
    this.engine = new ContinuumEngine();
    this.ui = new UI(this.engine);

    this.initEngine();
  }

  initEngine() {
    // create Producers, Resources, modifiers, reactors etc
    this.engine.createCurrency("gold", 300);

    this.createResources();
    this.createProducers();
  }

  createResources() {
    for (const res in resourceList) {
      this.engine.createResource(resourceList[res]);
    }
  }

  createProducers() {
    for (const prod in producerList) {
      this.engine.createProducer(producerList[prod]);
    }
  }

  onTick(dt: Date) {
    this.engine.onTick(dt);
    this.ui.update();
  }
}