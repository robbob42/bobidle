import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';
import { stringToColour, updateInventory, updateMoneyDisplay } from '../utils';


interface GameOutputRule {
  productionAmount: number,
}

interface GameOutputMap {
  currencies?: {
    [key: string]: GameOutputRule
  },
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
  display: string,
  productionTime: number,
  outputs: GameOutputMap,
  baseCost?: ContinuumEngine.CurrencyOpts,
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
  display;
  engine;
  color;
  productionTime;
  baseCost;
  costCoefficient;
  outputs;
  tooltip;

  constructor(opts: SeedOpts) {
    super("seed", opts);

    this.display = opts.display;
    this.engine = opts.engine;
    this.color = stringToColour(opts.key);
    this.productionTime = opts.productionTime;
    this.baseCost = opts.baseCost;
    this.costCoefficient = opts.costCoefficient || 1;
    this.outputs = opts.outputs || { currencies: {}, resources: {}, producers: {}, features: {}, seeds: {} };

    this.tooltip = {
      title: '',
      body: ''
    };
  }

  drawSeed(location: string): HTMLElement {
    // Set the tooltip (must be done after the engine setup is complete)
    let category: keyof typeof this.outputs;
    let outputList = '';
    for (category in this.outputs) {
      const outputs = this.outputs[category];

      for (const outputKey in outputs) {
        const gameObj = this.engine[category][outputKey];

        if (this.engine[category][outputKey] && 'display' in gameObj) {
          outputList += `<li>${gameObj.display} x${outputs[outputKey].productionAmount}</li>`;
        } else {
          outputList += `<li>${outputKey} x${outputs[outputKey].productionAmount}</li>`;
        }
      }
    }

    this.tooltip = {
      title: `${this.display} seed`,
      body: `Time to grow: ${this.productionTime / 1000} seconds<br />Produces: <ul>${outputList}</ul>`
    };

    // Draw the DOM element
    const b = document.createElement('cds-icon-button');
    let click = () => {b};

    if (location === 'inventory') {
      // Inventory Seed Button
      const callback = () => {
        this.engine.activeGarden().highlightAvailablePlots(true);
      }
      click = () => {
        if (this.engine.selectedEntity === this) {
          this.engine.unselect();
        } else {
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
        }
      }


    } else if (location === 'market') {
      // Market Seed Button
      click = () => {
        if (this.engine.selectedEntity === this) {
          this.engine.unselect();
        } else {
          const title = `Buy ${this.key} seed`;
          const btn = document.createElement('cds-button');
          btn.addEventListener('click', () => this.purchaseSeed());
          btn.innerHTML = 'Buy 1';
          const msgOpts = {
            msg: {
              title: title,
              body: '',
              DomElement: btn
            },
            entity: this,
            entityType: 'seed',
            msgStatus: 'info'
          }
          this.engine.setMessage(msgOpts);
        }
      }
    }

    const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    b.setAttribute('aria-label', this.key);
    b.className = 'seed-button';
    b.setAttribute('style', styleStr);
    b.innerHTML = `(${this.key.charAt(0).toLowerCase()})`;
    b.addEventListener('click', () => {click()});

    return b;
  }

  purchaseSeed() {
    const curr = this.baseCost?.currency;
    const amt = this.baseCost?.amount;
    if (curr && amt && this.engine.currencies[curr] && this.engine.currencies[curr].value >= amt) {
      this.engine.currencies[curr].incrementBy(-amt);
      const rtn = this.incrementBy(1);

      if (rtn) updateInventory(this);
      if (rtn) updateMoneyDisplay(undefined, this.engine);
    }
  }
}
