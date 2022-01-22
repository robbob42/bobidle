import GameEntity from './GameEntity';
import Seed from './Seed';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';


export interface InitPlotOpts {
  key: string,
  display: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  seed?: Seed,
  tooltip?: string,
  timeRemaining?: number
}

export type PlotOpts = InitPlotOpts & {
  engine: GameEngine,
}

export interface EmitPlanted {
  plot: Plot,
  seed: Seed
}

export interface EmitHarvested {
  plot: Plot,
  seed: Seed
}

export default class Plot extends GameEntity {
  display;
  active;
  beginTime;
  endTime;
  tooltip;
  _timeRemaining;
  _seed;

  constructor(opts: PlotOpts) {
    super("plot", opts);

    this.display = opts.display;
    this.active = false;
    this.beginTime = 0;
    this.endTime = 0;
    this.tooltip = opts.tooltip;
    this._seed = opts.seed;
    this._timeRemaining = 0;
  }

  set timeRemaining(v: number) {
    this._timeRemaining = v;
    if (this.seed) {
      this.card.body = `Seconds Remaining: ${v.toString()}`;

      if(v === 0) {
        this.highlightPlot(true);

        const harvestButton = document.getElementById(`${this.key}-harvest`);
        harvestButton?.removeAttribute('disabled');
      }
    }
  }

  get timeRemaining() {
    return this._timeRemaining || 0;
  }

  set seed(plantedSeed: Seed | undefined) {
    this._seed = plantedSeed;
    this.drawPlot(this.key);
  }

  get seed() {
    return this._seed;
  }

  processOutputs() {
    if (this.seed && this.seed.outputs) {
      // Loop through all of the seed outputs
      // Jankiness due to making TypeScript happy
      let category: keyof typeof this.seed.outputs;
      for (category in this.seed.outputs) {
        const outputs = this.seed.outputs[category];

        for (const output in outputs) {
          const outputRule = outputs[output];
          const gameObj = this.engine[category][output];

          gameObj.incrementBy(outputRule.productionAmount);
        }
      }
    }

    this.emit("SEED_HARVESTED", {
      plot: this,
      seed: this.seed
    });

    this.highlightPlot(false);
    this.toggleCard();
    this.seed = undefined;
  }

  drawPlot(plotId: number): HTMLElement {
    const harvestAction = document.createElement('cds-button');
    const harvestActionClick = () => {
      this.processOutputs();
    }

    harvestAction.id = `${this.key}-harvest`;
    harvestAction.setAttribute('action', 'flat-inline');
    harvestAction.innerHTML = 'Harvest';
    harvestAction.addEventListener('click', () => harvestActionClick());
    harvestAction.setAttribute('disabled', 'true');

    let body = '';
    if (this.seed) {
      body = `Seed: ${this.seed.display}`
    } else {
      body = 'This is a plot.  Once a seed is planted, it will show up here.'
    }

    // Assign each property, to ensure the Proxy is setup correctly
    this.card.key = this.key;
    this.card.type = 'plot';
    this.card.title = `${this.display}`;
    this.card.body = body;


    const click = () => {
      this.showCard = !this.showCard;
      // if (this.engine.selectedEntity === this && !this.seed) {
      //   this.engine.unselect();
      // } else {
      //   if (this.engine.selectedEntityType === 'seed') {
      //     this.plantSeed(this.engine.selectedEntity as Seed);
      //   } else if (this.seed && this.timeRemaining === 0) {
      //     this.processOutputs();
      //   } else {
      //     const plotName = `Plot ${this.key}`;
      //     let seedInfo = 'Currently Empty';
      //     if (this.seed) {
      //       seedInfo = `Seed: ${this.seed.display}`
      //     }
      //     const msgOpts = {
      //       msg: {
      //         title: plotName,
      //         body: seedInfo
      //       },
      //       entity: this,
      //       entityType: 'plot',
      //     }
      //     this.engine.setMessage(msgOpts);
      //   }
      // }
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
    d.style.margin = 'auto';
    d.addEventListener('click', () => {click()});

    const p = document.createElement('p');
    p.id = `plot-${plotId}-highlight`;
    p.style.width = '100%';
    p.style.height = '100%';
    p.style.margin = '0';
    d.appendChild(p);

    return this.drawEntity(d, harvestAction);
  }

  highlightPlot(highlight: boolean) {
    const plotDom = document.getElementById(`plot-${this.key}-highlight`) as HTMLElement;
    if (highlight) {
      plotDom.style.backgroundColor = '#eefce3';
      plotDom.style.boxShadow = '0 0 10px #000';
    } else {
      plotDom.style.backgroundColor = '#FFFFFF';
      plotDom.style.boxShadow = '';
    }
  }

  plantSeed(seed: Seed) {
    this.seed = seed;

    const plotName = `Plot ${this.key}`;
    let seedInfo = 'Currently Empty';
    if (this.seed) {
      seedInfo = `Seed: ${this.seed.display}`
    }

    const msgOpts = {
      msg: {
        title: plotName,
        body: seedInfo
      },
      entity: this,
      entityType: 'plot',
    }
    this.engine.setMessage(msgOpts);
    this.highlightPlot(false);

    this.beginTime = Date.now();
    this.endTime = Date.now() + this.seed.productionTime;
    this.timeRemaining = this.seed.productionTime / 1000;

    this.seed.incrementBy(-1);

    this.emit("SEED_PLANTED", {
      plot: this,
      seed: seed
    });
  }

  calculateSecondsRemaining() {
    if (!this.endTime) return 0;
    return Math.floor((this.endTime - Date.now()) / 1000)
  }

  calculatePctComplete() {
    const totalTime = this.endTime - this.beginTime;
    const currentTime = Date.now() - this.beginTime;
    return currentTime / totalTime;
  }
}