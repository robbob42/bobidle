import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';


export interface InitSeedOpts {
  key: string,
  id: number,
  engine: GameEngine,
  entityType: string,
  entityKey: string,
  productionAmount: number,
  productionTime: number
  baseCost: ContinuumEngine.CurrencyOpts;
  costCoefficient?: number;
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  color?: string,
}

export type SeedOpts = InitSeedOpts & {
  engine: GameEngine,
}

export default class Seed extends Entity {
  id;
  engine;
  entityType;
  color;
  productionAmount;
  productionTime;
  tooltip;
  baseCost;
  costCoefficient;

  constructor(opts: SeedOpts) {
    super("seed", opts);
    this.id = opts.id;
    this.engine = opts.engine;
    this.entityType = opts.entityType;
    this.color = this.stringToColour(opts.key);
    this.productionAmount = opts.productionAmount;
    this.productionTime = opts.productionTime;
    this.tooltip = `${opts.key} seed`;
    this.baseCost = opts.baseCost;
    this.costCoefficient = opts.costCoefficient || 1;
  }

  stringToColour(str: string) {
    let hash = 0;
    if (str.length === 0) return str;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 255;
        rgb[i] = value;
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  drawSeed(): HTMLElement {
    const callback = () => {
      this.engine.activeGarden().highlightAvailablePlots(true);
    }
    const click = (seed: Seed) => {
      const msgOpts = {
        msg: `${this.tooltip}`,
        entity: this,
        entityType: 'seed',
        callback: callback,
        msgStatus: 'info'
      }
      this.engine.setMessage(msgOpts);
      seed;
    }


    const s = document.createElement('span');
    s.id = `seed-${this.key}-${this.id}`;
    s.style.fontSize = '20px';
    s.style.fontWeight = 'bold';
    s.style.color = this.stringToColour(this.key);
    s.style.padding = '10px';
    s.style.cursor = 'pointer';
    s.innerHTML = '()';
    s.addEventListener('click', () => {click(this)})

    return s;
  }
}
