import { GameEngineType, JobTypes } from './game';


export function calcIdleZombies(engine: GameEngineType): number {
  return engine.resources.zombie.count - engine.resources.activezombie.count;
}

export function assignZombie(engine: GameEngineType, jobName: JobTypes): void {
  engine.producers[jobName].incrementBy(1);
  engine.producers[jobName].processingEnabled = true;
  engine.resources.activezombie.incrementBy(1);
}

export function unassignZombie(engine: GameEngineType, jobName: JobTypes): void {
  engine.producers[jobName].incrementBy(-1);
  engine.producers[jobName].processingEnabled = false;
  engine.resources.activezombie.incrementBy(-1);
}
