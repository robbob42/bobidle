import Resource from "../../../vendor/continuum/resource";
import GameEngine from './GameEngine';
import { ContinuumEngine } from '../types/Continuum';
import { stringToColour } from "../utils";

export interface InitGameResourceOpts {
  key: string,
  basePrice?: ContinuumEngine.CurrencyOpts,
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
  engine;
  color;
  tooltip;

  constructor(opts: GameResourceOpts) {
    super(opts);
    this.engine = opts.engine;
    this.color = stringToColour(opts.key);
    this.tooltip = {
      title: `Resource: ${opts.key}`,
      body: opts.tooltip?.body || ''
    };
  }

  drawResource(): HTMLElement {
    const callback = () => {
      this.engine.activeGarden().highlightAvailablePlots(false);
    }
    const click = () => {
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


    const b = document.createElement('cds-icon-button');
    const styleStr = `--background: white; --border-color: ${stringToColour(this.key)}; --color: ${stringToColour(this.key)}`;

    b.setAttribute('aria-label', this.key);
    b.className = 'resource-button';
    b.setAttribute('style', styleStr);
    b.innerHTML = `{${this.key.charAt(0).toLowerCase()}}`;
    b.addEventListener('click', () => {click()})

    return b;
  }
}
