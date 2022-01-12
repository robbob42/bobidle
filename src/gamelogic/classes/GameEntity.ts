import Entity from "../../../vendor/continuum/entity";
import GameEngine from './GameEngine';
import { ContinuumEngine } from '../types/Continuum';

type GameEntityOpts = {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine: GameEngine
}

// The sole purpose for this class is to ensure that 'engine' is types as the custom GameEngine.
// In all other aspects, this just mimics the Continuum Entity
export default class GameEntity extends Entity {
  engine: GameEngine;

  constructor(type: string, opts: GameEntityOpts) {
    super(type, opts);
    this.engine = opts.engine;
  }
}
