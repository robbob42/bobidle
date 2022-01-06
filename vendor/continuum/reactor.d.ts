import Engine from './engine';
import EventEmitter from "./eventemitter.js";
import { reactorOptsType, currencyOptsType } from '../../src/gamelogic/classes/types';


export default class Reactor extends EventEmitter {
  constructor(opts: reactorOptsType);
  state: {
      key: string;
      entityType: string;
      entityKey: string;
      basePrice: currencyOptsType;
      count: number;
      maxCount: number;
  };
  engine: Engine;
  get key(): string;
  get entityType(): string;
  get entityKey(): string;
  get basePrice(): currencyOptsType;
  get count(): number;
  get entity(): number;
  purchase(): boolean;
}