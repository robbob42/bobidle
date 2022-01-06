import Entity from './entity';
import { resourceOptsType, CalcDefObj, currencyOptsType } from '../../src/gamelogic/classes/types';


export default class Resource extends Entity {
  constructor(opts: resourceOptsType);
  calculated: CalcDefObj;
  get basePrice(): currencyOptsType;
  calculatePrice(amountToSell: number): {
      currency: string;
      amount: number;
  };
  processTick(dt: number): void;
}
