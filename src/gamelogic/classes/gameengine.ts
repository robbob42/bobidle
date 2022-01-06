import Engine from '../../../vendor/continuum/engine';
import Seed from './seed';
import { seedOptsType } from './types';

type seedsType = {
  [key: string]: Seed
}

export default class Gameengine extends Engine {
  seeds: seedsType = {};

  constructor() {
    super();
  }

  createSeed(opts: seedOptsType) {
    if ( !opts ) throw "No resource options provided";
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.seeds[opts.key]) {
        opts.engine = this;
        this.seeds[opts.key] = new Seed(opts);
    }
    return this.seeds[opts.key];
  }

}