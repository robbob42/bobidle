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

export function convertHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600); // get hours
  const minutes = Math.floor((seconds - (hours * 3600)) / 60); // get minutes
  const sec = seconds - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  let str = '';
  if (hours > 0 && hours < 10) str += '0';
  if (hours > 0) str += hours.toString(10);

  if (minutes > 0) str += ':';
  if (minutes > 0 && minutes < 10) str += '0';
  if (minutes > 0) str += minutes.toString(10);

  str += ':';
  if (sec < 10) str += '0';
  if (sec >= 0) str += sec.toString(10);
  return str; // Return is HH : MM : SS
}
