import Engine from '../../../vendor/continuum/engine';
import Seed from './seed';
import { requirementMap } from '../../../vendor/continuum/entity';

export type seedOptsType = {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: requirementMap,
  engine: Engine
}

export type seedsType = {
  [key: string]: Seed
}

export default class Gameengine {
  private _seeds: seedsType;
  createSeed(opts: seedOptsType): seedsType;
}
