import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';


interface GardenDimensions {
  width: number,
  height: number
}

export interface GardenOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine?: ContinuumEngine.Engine,
  dimensions: GardenDimensions,
  active: boolean
}

export default class Garden extends Entity {
  dimensions: GardenDimensions;
  active: boolean;

  constructor(opts: GardenOpts) {
    super("seed", opts);

    this.dimensions = opts.dimensions;
    this.active = opts.active;
  }

  drawGarden(): HTMLElement {
    const s = document.createElement('span');
    const topP = document.createElement('p');
    const middleP = document.createElement('p');
    const bottomP = document.createElement('p');

    // Top Line
    let gardenString = '&nbsp;';
    for (let i = 1; i <= this.dimensions.width; i++) {
      gardenString += '__';
    }
    topP.innerHTML = gardenString;

    // Middle Lines
    gardenString = '|';
    for (let i = 1; i <= this.dimensions.width; i++) {
      gardenString += '&nbsp;&nbsp;';
    }
    gardenString += '|';
    middleP.innerHTML = gardenString;

    // Bottom Line
    gardenString = '&nbsp;';
    for (let i = 1; i <= this.dimensions.width; i++) {
      gardenString += '__';
    }
    bottomP.innerHTML = gardenString;

    topP.style.position = 'relative';
    topP.style.top = '10px';
    bottomP.style.position = 'relative';
    bottomP.style.top = '-24px';

    s.appendChild(topP);
    s.appendChild(middleP);
    s.appendChild(bottomP);

    return s;
  }
}