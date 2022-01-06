import Entity from '../../../vendor/continuum/entity';
import { seedOptsType } from './types';

export default class Seed extends Entity {
  constructor(opts: seedOptsType) {
      super("seed", opts);
  }
}