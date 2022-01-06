import Resource from './resource';
import Producer from './producer';
import Currency from './currency';
import Modifier from './modifier';
import Reactor from './reactor';
import { resourceOptsType, producerOptsType, currencyOptsType,
  modifierOptsType, reactorOptsType } from '../../src/gamelogic/classes/types';

export default class ContinuumEngine {
  lastTick: number;
  lastSave: number;
  currencies: {
    [key: string]: Currency;
  };
  producers: {
    [key: string]: Producer;
  };
  resources: {
    [key: string]: Resource;
  };
  modifiers: {
    [key: string]: Modifier;
  };
  reactors: {
    [key: string]: Reactor;
  };
  activeModifiers: Modifier[];
  numberFormatter: (val: number, decimals: number) => string;
  autosavePeriod: number;
  createCurrency(opts: currencyOptsType): Currency;
  currency(type: string): Currency;
  createProducer(opts: producerOptsType): Producer;
  destroyProducer(key: string): void;
  producer(key: string): Producer;
  createResource(opts: resourceOptsType): Resource;
  resource(key: string): Resource;
  createModifier(opts: modifierOptsType): Modifier;
  modifier(key: string): Modifier;
  createReactor(opts: reactorOptsType): Reactor;
  reactor(key: string): Reactor;
  activateModifier(key: string, opts: {timeleft: number}): void;
  onTick(dt: number): void;
  autoSave(dt: number): void;
  saveState(): void;
  loadState(): void;
  processProducers(dt: number): void;
  processResources(dt: number): void;
  processModifiers(dt: number): void;
  setNumberFormatter(type: string): void;
  formatNumber(n: number, decimals?: number): string;
}