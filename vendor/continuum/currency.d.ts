import EventEmitter from "./eventemitter.js";
import { currencyOptsType } from '../../src/gamelogic/classes/types';


type stateType = {
  type: string;
  value: number;
}

export default class Currency extends EventEmitter {
  constructor(opts: currencyOptsType);
  state: stateType;
  set value(arg: number);
  get value(): number;
  get type(): string;
  serialise(): stateType;
  deserialise(o: stateType): void;
  incrementBy(value: number): void;
}