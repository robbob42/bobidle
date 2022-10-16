import GameEntity, { GameOutputMap } from './GameEntity';
import { ContinuumEngine } from '../types/Continuum';
import GameEngine from './GameEngine';
import { stringToColour, updateMoneyDisplay } from '../utils';


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
  /**
   * Custom class extending Continuum Entity.
   *
   * @param opts - Object containing default values for this Seed.  Type definition above.
   *
   */
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

  incrementBy(val: number): number {
    /**
     * Increment the variable in the game engine tracking the number of seeds.  Also increment the DOM display of this value
     *
     * @param val - The number to increment by
     * 
     */
    
    this.card.title = `${this.display} x ${this.count + val}`;
    if (this.count > 0 && this.count + val === 0){
      this.toggle(false);
    }
    if (this.count === 0 && this.count + val > 0) {
      this.toggle(true);
    }
    return super.incrementBy(val);
  }

  drawSeed(location: string) {
    /**
     * Draw the DOM UI element that will represent this seed
     *
     * @param location - Special one-time rules to apply to specific seeds
     * 
     */
    
    let outputList = '';
    let category: keyof typeof this.outputs;
    for (category in this.outputs) {
      const outputs = this.outputs[category];

      for (const outputKey in outputs) {
        const gameObj = this.engine[category][outputKey];

        if (this.engine[category][outputKey] && 'display' in gameObj) {
          outputList += `<li>${gameObj.display}`;
        } else {
          outputList += `<li>${outputKey}`;
        }
        if (outputs[outputKey].productionAmount > 1) {
          outputList += ` x ${outputs[outputKey].productionAmount}`;
        }
        outputList += '</li>';
      }
    }

    const plantAction = document.createElement('cds-button');

    const plantActionClick = () => {
      const garden = this.engine.activeGarden();
      for (const plotKey in garden.plots) {
        if (!garden.plots[plotKey].seed){
          garden.plots[plotKey].plantSeed(this);
        }
      }
    }
    plantAction.setAttribute('action', 'flat-inline');
    plantAction.innerHTML = 'Plant';
    plantAction.addEventListener('click', () => plantActionClick());

    // Assign each property, to ensure the Proxy is setup correctly
    this.card.key = this.key;
    this.card.type = 'seed';
    this.card.title = `${this.display} x ${this.count}`;
    this.card.body = `Time to grow: ${this.productionTime / 1000} seconds<br />Produces: <ul>${outputList}</ul>`;

    // Draw the DOM element
    let click = () => {null};

    if (location === 'inventory' || location === 'feature-first-seed') {
      click = () => {
        this.showCard = !this.showCard;
      }


    } else if (location === 'market') {
      // Market Seed Button
      click = () => {
        this.showCard = !this.showCard;
      }
    }

    const entityElement = document.createElement('cds-icon-button');
    const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    entityElement.setAttribute('aria-label', this.key);
    entityElement.className = `${this.type}-button`;
    entityElement.setAttribute('style', styleStr);
    entityElement.innerHTML = `(${this.key.charAt(0).toLowerCase()})`;
    entityElement.addEventListener('click', () => {click()});

    const s = document.getElementById(`${this.key}-seed-container`);
    if (!s) {
      const i = document.getElementById(location);
      const seedBtn = this.drawEntity(entityElement, plantAction);

      seedBtn.style.textAlign = 'center';
      if (!this.count) seedBtn.style.display = 'none';
      i?.appendChild(seedBtn);
    }
  }

  purchaseSeed() {
    /**
     * Increment seed count, decrement currency
     */
    
    const curr = this.baseCost?.currency;
    const amt = this.baseCost?.amount;
    if (curr && amt && this.engine.currencies[curr] && this.engine.currencies[curr].value >= amt) {
      this.engine.currencies[curr].incrementBy(-amt);
      const rtn = this.incrementBy(1);

      if (rtn) updateMoneyDisplay(undefined, this.engine);
    }
  }
}
