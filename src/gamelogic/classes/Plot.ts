import Entity from '../../../vendor/continuum/entity';
import Seed from './Seed';
import { ContinuumEngine } from '../types/Continuum';

export interface PlotOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine?: ContinuumEngine.Engine,
  seed?: Seed
}

export default class Plot extends Entity {
  seed: Seed | undefined;
  active;
  timeRemaining;

  constructor(opts: PlotOpts) {
    super("plot", opts);

    this.active = false;
    this.timeRemaining = 0;
  }

  drawPlot(gridCols: number, plotId: number): HTMLElement {
    const click = (plot: Plot) => {
      // console.log(elem);
      plot;
    }

    const s = document.createElement('span');
    s.setAttribute('cds-layout', `container:center col:${gridCols}`);
    s.addEventListener('click', () => {click(this)})
    s.id = `plot-${plotId}`;
    const topP = document.createElement('p');
    const middleP = document.createElement('p');
    const bottomP = document.createElement('p');

    // Top Line
    let gardenString = '&nbsp;';
    gardenString += '__';
    topP.innerHTML = gardenString;

    // Middle Lines
    gardenString = '|';
    gardenString += '&nbsp;&nbsp;';
    gardenString += '|';
    middleP.innerHTML = gardenString;

    // Bottom Line
    gardenString = '&nbsp;';
    gardenString += '__';
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