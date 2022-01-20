import GameEntity, { cardObj } from './GameEntity';
import GameEngine from './GameEngine';
import { ContinuumEngine } from '../types/Continuum';
import { stringToColour, updateResources, updateMoneyDisplay, updateMarketSell } from "../utils";

interface CalcDefObj {
  source: GameEntity,
  calcFunc: (source: GameEntity) => number
}

export interface InitGameResourceOpts {
  key: string,
  display: string,
  basePrice: ContinuumEngine.CurrencyOpts,
  color?: string,
  tooltip?: {
    title?: string,
    body?: string
  }
  calculated?: CalcDefObj
}

export type GameResourceOpts = InitGameResourceOpts & {
  engine: GameEngine,
}

export default class GameResource extends GameEntity {
  display;
  engine;
  color;
  tooltip;
  calculated;

  constructor(opts: GameResourceOpts) {
    super("resource", opts);

    this.state.basePrice = opts.basePrice;

    this.calculated = opts.calculated;
    this.display = opts.display;
    this.engine = opts.engine;
    this.color = stringToColour(opts.key);
    this.tooltip = {
      title: `${opts.display}`,
      body: `Value: ${opts.basePrice.amount}`
    };
  }

  get basePrice() {
    return this.state.basePrice;
}

  drawResource(location: string): HTMLElement {
    const msg: cardObj = {
      key: this.key,
      type: 'resource',
      title: `${this.display}`,
      body: `This is really great!`,
      actions: ''
    }

    // Draw the DOM element
    let click = () => {null};

    if (location === 'inventory') {
      click = () => {
        this.toggleCard(msg);
      }
    } else if (location === 'market') {
      click = () => {
        this.toggleCard(msg);
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

    // const b = document.createElement('cds-icon-button');
    // let click = () => {b};

    // if (location === 'resources') {
    //   // Inventory Seed Button
    //   const callback = () => {
    //     this.engine.activeGarden().highlightAvailablePlots(false);
    //   }
    //   click = () => {
    //     if (this.engine.selectedEntity === this) {
    //       this.engine.unselect();
    //     } else {
    //     const msgOpts = {
    //         msg: {
    //           title: this.tooltip.title,
    //           body: this.tooltip.body
    //         },
    //         entity: this,
    //         entityType: 'resource',
    //         callback: callback,
    //         msgStatus: 'info'
    //       }
    //       this.engine.setMessage(msgOpts);
    //     }
    //   }
    // } else if (location === 'market') {
    //   // Market Seed Button
    //   click = () => {
    //     if (this.engine.selectedEntity === this) {
    //       this.engine.unselect();
    //     } else {
    //       const title = `Sell ${this.key}`;
    //       const btn = document.createElement('cds-button');
    //       btn.addEventListener('click', () => this.sellResource());
    //       btn.innerHTML = 'Sell 1';
    //       const msgOpts = {
    //         msg: {
    //           title: title,
    //           body: '',
    //           DomElement: btn
    //         },
    //         entity: this,
    //         entityType: 'resource',
    //         msgStatus: 'info'
    //       }
    //       this.engine.setMessage(msgOpts);
    //     }
    //   }
    // }

    // const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    // b.setAttribute('aria-label', this.key);
    // b.className = 'resource-button';
    // b.setAttribute('style', styleStr);
    // b.innerHTML = `}${this.key.charAt(0).toUpperCase()}{`;
    // b.addEventListener('click', () => {click()})

    // return b;
  }

  sellResource() {
    const curr = this.basePrice?.currency;
    const amt = this.basePrice?.amount;
    if (curr && amt && this.count >= 1) {
      this.engine.currencies[curr].incrementBy(amt);
      const rtn = this.incrementBy(-1);
      if (rtn) updateResources(this);
      if (rtn) updateMoneyDisplay(undefined, this.engine);
      if (rtn) updateMarketSell(this);
    }
  }

  calculatePrice(amountToSell: number) {
    if (this.state.basePrice) {
      amountToSell = amountToSell || this.state.count;
      return { currency: this.state.basePrice.currency, amount: amountToSell * this.state.basePrice.amount };
    }
    return null;
  }

  processTick() {
    if (this.calculated && typeof this.calculated === "object") {
      let obj: GameEntity = {} as GameEntity;
      const source = this.calculated.source;

      switch (source.type) {
        case "resource":
          obj = this.engine.resources[source.key];
          break;

        case "seed":
          obj = this.engine.seeds[source.key];
          break;

        default:
          break;
      }
      if (obj) {
        this.state.count = this.calculated.calcFunc(obj);
      }
    }
  }
}
