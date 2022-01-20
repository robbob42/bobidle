import Resource from "../../../vendor/continuum/resource";
import GameEngine from './GameEngine';
import { ContinuumEngine } from '../types/Continuum';
import { stringToColour, updateResources, updateMoneyDisplay, updateMarketSell } from "../utils";

export interface InitGameResourceOpts {
  key: string,
  display: string,
  basePrice: ContinuumEngine.CurrencyOpts,
  color?: string,
  tooltip?: {
    title?: string,
    body?: string
  }
}

export type GameResourceOpts = InitGameResourceOpts & {
  engine: GameEngine,
}

export default class GameResource extends Resource {
  display;
  engine;
  color;
  tooltip;

  constructor(opts: GameResourceOpts) {
    super(opts);

    this.display = opts.display;
    this.engine = opts.engine;
    this.color = stringToColour(opts.key);
    this.tooltip = {
      title: `${opts.display}`,
      body: `Value: ${opts.basePrice.amount}`
    };
  }

  drawResource(location: string): HTMLElement {
    const b = document.createElement('cds-icon-button');
    let click = () => {b};

    if (location === 'resources') {
      // Inventory Seed Button
      const callback = () => {
        this.engine.activeGarden().highlightAvailablePlots(false);
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
            entityType: 'resource',
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
          const title = `Sell ${this.key}`;
          const btn = document.createElement('cds-button');
          btn.addEventListener('click', () => this.sellResource());
          btn.innerHTML = 'Sell 1';
          const msgOpts = {
            msg: {
              title: title,
              body: '',
              DomElement: btn
            },
            entity: this,
            entityType: 'resource',
            msgStatus: 'info'
          }
          this.engine.setMessage(msgOpts);
        }
      }
    }

    const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    b.setAttribute('aria-label', this.key);
    b.className = 'resource-button';
    b.setAttribute('style', styleStr);
    b.innerHTML = `}${this.key.charAt(0).toUpperCase()}{`;
    b.addEventListener('click', () => {click()})

    return b;
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
}
