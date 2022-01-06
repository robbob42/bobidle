import UI from "./ui";
import resourceList from "./resources";
import producerList from "./producers";
import Engine from '../gamelogic/classes/gameengine';


export default class Game {
  engine;
  ui;

  constructor() {
    this.engine = new Engine();
    this.ui = new UI(this.engine);

    this.initEngine();
  }

  initEngine() {
    // create Producers, Resources, modifiers, reactors etc
    this.engine.createCurrency({currency: "gold", amount: 300});

    this.createResources();
    this.createProducers();

    this.ui.init();
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

  onTick(dt: number) {
    this.engine.onTick(dt);
    this.ui.update();
  }
}