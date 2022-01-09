import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';


export interface InitSeedOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine: GameEngine
}

export type SeedOpts = InitSeedOpts & {
  engine: GameEngine,
}

export default class Seed extends Entity {
  engine: GameEngine;

  constructor(opts: SeedOpts) {
      super("seed", opts);

      this.engine = opts.engine;
  }
}