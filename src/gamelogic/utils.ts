import { GameEngineType } from './game';

export function calcActiveZombies(engine: GameEngineType): number {
  return engine.resources.zombie.active
}

export function incrementActiveZombies(engine: GameEngineType, num: number): void {
  engine.resources.zombie.active += num;
}