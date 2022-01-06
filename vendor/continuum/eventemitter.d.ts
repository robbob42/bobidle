import Modifier from './modifier';
import Entity from './entity';
import { eventType, emitType } from '../../src/gamelogic/classes/types';

export default class EventEmitter {
  events: eventType;
  on(event: string, listener: (e: emitType) => void): () => void;
  off(event: string): void;
  removeListener(event: string, listener: () => void): void;
  emit(event: string, args: Entity): void;
  once(event: string, listener: Modifier): void;
}