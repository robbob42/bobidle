import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';
import { stringToColour } from '../utils';


interface GameOutputRule {
  productionAmount: number,
}

interface GameOutputMap {
  resources?: {
    [key: string]: GameOutputRule
  },
  producers?: {
    [key: string]: GameOutputRule
  },
  features?: {
    [key: string]: GameOutputRule
  },
  seeds?: {
    [key: string]: GameOutputRule
  }
}

export interface InitSeedOpts {
  key: string,
  productionTime: number,
  baseCost: ContinuumEngine.CurrencyOpts,
  outputs: GameOutputMap,
  costCoefficient?: number,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  color?: string,
  tooltip?: {
    title?: string,
    body?: string
  }
}

export type SeedOpts = InitSeedOpts & {
  engine: GameEngine,
}

export default class Seed extends Entity {
  engine;
  color;
  productionTime;
  baseCost;
  costCoefficient;
  outputs;
  tooltip;

  constructor(opts: SeedOpts) {
    super("seed", opts);
    this.engine = opts.engine;
    this.color = stringToColour(opts.key);
    this.productionTime = opts.productionTime;
    this.baseCost = opts.baseCost;
    this.costCoefficient = opts.costCoefficient || 1;
    this.outputs = opts.outputs || { resources: {}, producers: {}, features: {}, seeds: {} };
    this.tooltip = {
      title: `Seed: ${opts.key}`,
      body: opts.tooltip?.body || ''
    };
  }

  drawSeed(): HTMLElement {
    const callback = () => {
      this.engine.activeGarden().highlightAvailablePlots(true);
    }
    const click = (seed: Seed) => {
      const msgOpts = {
        msg: {
          title: this.tooltip.title,
          body: this.tooltip.body
        },
        entity: this,
        entityType: 'seed',
        callback: callback,
        msgStatus: 'info'
      }
      this.engine.setMessage(msgOpts);
      seed;
    }


    const b = document.createElement('cds-icon-button');
    const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    b.setAttribute('aria-label', this.key);
    b.className = 'seed-button';
    b.setAttribute('style', styleStr);
    b.innerHTML = `(${this.key.charAt(0).toLowerCase()})`;
    b.addEventListener('click', () => {click(this)})

    return b;
  }
}
