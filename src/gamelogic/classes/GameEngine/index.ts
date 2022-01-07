import Seed, { seedOpts } from '../seed';
import Engine from '../../../../vendor/continuum/engine';
import { ContinuumEngine } from '../../types/Continuum';

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
}