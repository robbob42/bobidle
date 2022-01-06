import Engine from './classes/gameengine';


export function calcIdleZombies(engine: Engine): number {
  return engine.resources.zombie.count - engine.resources.activezombie.count;
}

export function assignZombie(engine: Engine, jobName: string): void {
  engine.producers[jobName].incrementBy(1);
  engine.producers[jobName].processingEnabled = true;
  engine.resources.activezombie.incrementBy(1);
}

export function unassignZombie(engine: Engine, jobName: string): void {
  engine.producers[jobName].incrementBy(-1);
  engine.producers[jobName].processingEnabled = false;
  engine.resources.activezombie.incrementBy(-1);
}
