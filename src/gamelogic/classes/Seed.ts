import GameEntity, { GameOutputMap, cardObj } from './GameEntity';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';
import { stringToColour, updateInventory, updateMoneyDisplay } from '../utils';
import seeds from '../seeds';


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
}

export type SeedOpts = InitSeedOpts & {
  engine: GameEngine,
}

export default class Seed extends GameEntity {
  engine;
  color;
  productionTime;
  baseCost;
  costCoefficient;
  outputs;

  constructor(opts: SeedOpts) {
    super("seed", opts);

    this.engine = opts.engine;
    this.color = stringToColour(opts.key);
    this.productionTime = opts.productionTime;
    this.baseCost = opts.baseCost;
    this.costCoefficient = opts.costCoefficient || 1;
    this.outputs = opts.outputs || { currencies: {}, resources: {}, producers: {}, features: {}, seeds: {} };
  }

  drawSeed(location: string) {
    let outputList = '';
    let category: keyof typeof this.outputs;
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

    const msg: cardObj = {
      key: this.key,
      type: 'seed',
      title: `${this.display} Seed`,
      body: `Time to grow: ${this.productionTime / 1000} seconds<br />Produces: <ul>${outputList}</ul>`,
      actions: ''
    }

    // Draw the DOM element
    let click = () => {null};

    if (location === 'inventory') {
      // Inventory Seed Button
      const callback = () => {
        this.engine.activeGarden().highlightAvailablePlots(true);
      }
      click = () => {
        this.toggleCard(msg);
        // if (this.engine.selectedEntity === this) {
        //   this.engine.unselect();
        // } else {
        //   const msgOpts = {
        //     msg: {
        //       title: this.card.title,
        //       body: this.card.body
        //     },
        //     entity: this,
        //     entityType: 'seed',
        //     callback: callback,
        //     msgStatus: 'info'
        //   }
        //   this.engine.setMessage(msgOpts);
        // }
      }


    } else if (location === 'market') {
      // Market Seed Button
      click = () => {
        this.toggleCard(msg);
        // if (this.engine.selectedEntity === this) {
        //   this.engine.unselect();
        // } else {
        //   const title = `Buy ${this.key} seed`;
        //   const btn = document.createElement('cds-button');
        //   btn.addEventListener('click', () => this.purchaseSeed());
        //   btn.innerHTML = 'Buy 1';
        //   const msgOpts = {
        //     msg: {
        //       title: title,
        //       body: '',
        //       DomElement: btn
        //     },
        //     entity: this,
        //     entityType: 'seed',
        //     msgStatus: 'info'
        //   }
        //   this.engine.setMessage(msgOpts);
        // }
      }
    }

    const entityElement = document.createElement('cds-icon-button');
    const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    entityElement.setAttribute('aria-label', this.key);
    entityElement.className = `${this.type}-button`;
    entityElement.setAttribute('style', styleStr);
    entityElement.innerHTML = `(${this.key.charAt(0).toLowerCase()})`;
    entityElement.addEventListener('click', () => {click()});

    return this.drawEntity(entityElement);
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
