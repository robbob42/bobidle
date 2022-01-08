import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';


export interface seedOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine?: ContinuumEngine.Engine
}

export default class Seed extends Entity {
  constructor(opts: seedOpts) {
      super("seed", opts);
  }
}