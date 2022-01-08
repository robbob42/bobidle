import Gameengine from './classes/GameEngine';


export function calcIdleZombies(engine: Gameengine): number {
  return engine.resources.zombie.count - engine.resources.activezombie.count;
}

export function assignZombie(engine: Gameengine, jobName: string): void {
  engine.producers[jobName].incrementBy(1);
  engine.producers[jobName].processingEnabled = true;
  engine.resources.activezombie.incrementBy(1);
}

export function unassignZombie(engine: Gameengine, jobName: string): void {
  engine.producers[jobName].incrementBy(-1);
  engine.producers[jobName].processingEnabled = false;
  engine.resources.activezombie.incrementBy(-1);
}
