import ContinuumEngine from '../../vendor/continuum/engine';
import Producer from '../../vendor/continuum/producer';
import Resource from '../../vendor/continuum/resource';
import UI from "./ui";
import resourceList from "./resources";
import producerList from "./producers"

interface ZombieResource extends Resource {
  active: number
}

export interface GameEngineType extends ContinuumEngine {
  resources: {
    rock: Resource,
    clay: Resource,
    fish: Resource,
    tree: Resource,
    grain: Resource,
    zombie: ZombieResource,
    power: Resource
  },
  producers: {
    miner: Producer,
    claygrabber: Producer,
    fisher: Producer,
    arborist: Producer,
    farmer: Producer
  }
}

export default class Game {
  engine;
  ui;

  constructor() {
    this.engine = new ContinuumEngine() as GameEngineType;
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

  onTick(dt: number) {
    this.engine.onTick(dt);
    this.ui.update();
  }
}