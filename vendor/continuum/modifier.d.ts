import Entity from './entity';
import { modifierOptsType } from '../../src/gamelogic/classes/types';

export default class Modifier {
  constructor(opts: modifierOptsType);
  state: {
      key: string;
  };
  apply: (entityType: string, entity: Entity) => void;
  remove: (entityType: string, entity: Entity) => void;
}