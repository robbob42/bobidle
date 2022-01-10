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

export interface EmitPlanted {
  plot: Plot,
  seed: Seed
}

export default class Plot extends GameEntity {
  seed: Seed | undefined;
  active;
  beginTime;
  endTime;
  timeRemaining;
  tooltip;

  constructor(opts: PlotOpts) {
    super("plot", opts);

    this.active = false;
    this.timeRemaining = 0;
    this.beginTime = 0;
    this.endTime = 0;
    this.tooltip = opts.tooltip;
  }

  drawPlot(gridCols: number, plotId: number): HTMLElement {
    const click = () => {
      if (this.engine.selectedEntityType === 'seed') {
        this.plantSeed(this.engine.selectedEntity as Seed);
      } else {
        const plotName = `Plot ${this.key}`;
        let seedInfo = 'Currently Empty';
        if (this.seed) {
          seedInfo = `Seed: ${this.seed.key}`
        }
        const msgOpts = {
          msg: `${plotName}<br />${seedInfo}`,
          entity: this,
          entityType: 'plot',
        }
        this.engine.setMessage(msgOpts);
      }
    }

    const d = document.createElement('div');
    d.id = `plot-${plotId}`;
    d.style.border = '1px solid black';
    d.style.width = '50px';
    d.style.height = '50px';
    d.style.textAlign = 'center';
    d.style.verticalAlign = 'middle';
    d.style.lineHeight = '50px';
    d.style.cursor = 'pointer';
    d.setAttribute('cds-layout', `container:center col:${gridCols}`);
    d.addEventListener('click', () => {click()});

    const p = document.createElement('p');
    p.id = `plot-${plotId}-highlight`;
    p.style.width = '100%';
    p.style.height = '100%';
    p.style.margin = '0';
    d.appendChild(p);

    return d;
  }

  highlightPlot(highlight: boolean) {
    const plotDom = document.getElementById(`plot-${this.key}-highlight`) as HTMLElement;
    if (highlight) {
      plotDom.style.backgroundColor = '#BBBBBB';
    } else {
      plotDom.style.backgroundColor = '#FFFFFF';
    }
  }

  plantSeed(seed: Seed) {
    this.seed = seed;

    const plotName = `Plot ${this.key}`;
    let seedInfo = 'Currently Empty';
    if (this.seed) {
      seedInfo = `Seed: ${this.seed.key}`
    }
    const msg = `${plotName}<br />${seedInfo}`;

    const msgOpts = {
      msg: `${msg}`,
      entity: this,
      entityType: 'plot',
    }
    this.engine.setMessage(msgOpts);
    this.highlightPlot(false);

    this.emit("SEED_PLANTED", {
      plot: this,
      seed: seed
    });
  }

  enableCounter() {
    const domElement = document.getElementById(`plot-${this.key}`) as HTMLElement;
    const parent = domElement.parentElement as HTMLElement;

    const d = document.createElement('div');
    d.setAttribute('cds-layout', 'container:center col:12');
    d.id = `plot-${this.key}-counter`;
    parent.appendChild(d);
  }
}