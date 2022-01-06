import Engine from './engine';
import EventEmitter from "./eventemitter.js";
import { requirementMap, entityOptsType } from '../../src/gamelogic/classes/types';


type stateType = {
  type: string;
  key: string;
  count: number;
  maxCount: number;
}

export default class Entity extends EventEmitter {
  constructor(type: string, opts: entityOptsType);
  state: stateType;
  requirements: requirementMap;
  lastProcessed: number;
  engine: Engine;
  get type(): string;
  get key(): string;
  get count(): number;
  get maxCount(): number;
  serialise(): stateType;
  deserialise(o: stateType): void;
  incrementBy(val: number): number;
  requirementsMet(): boolean;
  onTick(dt: number): void;
  processTick(dt: number): void;
  canProcess(dt: number): boolean;
}