import Seed, { seedOpts } from './Seed';
import Garden, { GardenOpts } from './Garden';
import Engine from '../../../vendor/continuum/engine';
import { ContinuumEngine } from '../types/Continuum';

export default class Gameengine extends Engine {
  seeds: {
    [key: string]: Seed;
  } = {};
  resources: {
    [key: string]: ContinuumEngine.Resource;
  } = {};
  producers: {
    [key: string]: ContinuumEngine.Producer;
  } = {};
  gardens: {
    [key: string]: Garden
  } = {}

  constructor() {
    super();
  }

  createSeed(opts: seedOpts) {
    if ( !opts ) throw "No resource options provided";
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.seeds[opts.key]) {
        opts.engine = this;
        this.seeds[opts.key] = new Seed(opts);
    }
    return this.seeds[opts.key];
  }

  createGarden(opts: GardenOpts) {
    if ( !opts ) throw "No resource options provided";
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.gardens[opts.key]) {
        opts.engine = this;
        this.gardens[opts.key] = new Garden(opts);
    }
    return this.gardens[opts.key];
  }

  activeGarden(): Garden {
    const activeGarden = Object.entries(this.gardens).filter(([, garden]) => garden.active)[0];
    return this.gardens[activeGarden[0]];
  }
}