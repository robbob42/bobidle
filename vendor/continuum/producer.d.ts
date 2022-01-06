import Entity from './entity';
import Currency from './currency';
import { producerOptsType, InputMap, OutputMap, PostProcessorMap, currencyOptsType } from '../../src/gamelogic/classes/types';


export default class Producer extends Entity {
  constructor(opts: producerOptsType);
  inputs: InputMap;
  outputs: OutputMap;
  postProcessors: PostProcessorMap;
  get baseCost(): currencyOptsType;
  get costCoefficient(): number;
  get consumedInputs(): InputMap;
  set processingEnabled(arg: boolean);
  get processingEnabled(): boolean;
  resetTimers(): void;
  calculateCost(count: number): {
      currency: Currency;
      price: number;
  };
  addOutput(outputType: string, outputKey: string, productionTime: number, productionAmount: number): Producer;
  getOutput(outputType: string, outputKey: string): Producer;
  processTick(dt: number): void;
}