import ContinuumEngine from '../../vendor/continuum/engine';
import Producer from '../../vendor/continuum/producer';
import Resource from '../../vendor/continuum/resource';
import UI from "./ui";
import resourceList from "./resources";
import producerList from "./producers"


export interface GameEngineType extends ContinuumEngine {
  resources: {
    rock: Resource,
    clay: Resource,
    fish: Resource,
    tree: Resource,
    grain: Resource,
    zombie: Resource,
    activezombie: Resource,
    power: Resource
  },
  producers: {
    "miner": Producer,
    "mucker": Producer,
    "fisher": Producer,
    "arborist": Producer,
    "farmer": Producer
  }
}

export type JobTypes = 'miner' | 'mucker' | 'fisher' | 'arborist' | 'farmer';
export type ResourceTypes = 'rock' | 'clay' | 'fish' | 'tree' | 'grain' | 'zombie' | 'activezombie' | 'power';

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

    this.ui.init();
  }

  createResources() {
    for (const res in resourceList) {
      this.engine.createResource(resourceList[res as ResourceTypes]);
    }
  }

  createProducers() {
    for (const prod in producerList) {
      this.engine.createProducer(producerList[prod as JobTypes]);
    }
  }

  onTick(dt: number) {
    this.engine.onTick(dt);
    this.ui.update();
  }
}