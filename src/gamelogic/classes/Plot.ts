import GameEntity from './GameEntity';
import Seed from './Seed';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';


export interface InitPlotOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  seed?: Seed,
  tooltip?: string
}

export type PlotOpts = InitPlotOpts & {
  engine: GameEngine,
}

export default class Plot extends GameEntity {
  seed: Seed | undefined;
  active;
  timeRemaining;
  tooltip;

  constructor(opts: PlotOpts) {
    super("plot", opts);

    this.active = false;
    this.timeRemaining = 0;
    this.tooltip = opts.tooltip;
  }

  drawPlot(gridCols: number, plotId: number): HTMLElement {
    const click = (plot: Plot) => {
      const plotName = `Plot ${this.key}`;
      let seedInfo = 'Currently Empty';
      if (this.seed) {
        seedInfo = `Seed: ${this.seed.key}`
      }
      this.engine.setMessage(`${plotName}<br />${seedInfo}`, 'info');
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

  plantSeed(seed: Seed) {
    this.seed = seed;
  }
}