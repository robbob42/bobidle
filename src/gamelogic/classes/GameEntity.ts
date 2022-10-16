import Entity from "../../../vendor/continuum/entity";
import GameEngine from './GameEngine';
import { ContinuumEngine } from '../types/Continuum';
import { stringToColour } from '../utils';

export interface cardObj {
  key: string,
  type: string,
  title: string,
  body: string
}

export interface GameOutputRule {
  productionAmount: number,
}

export interface GameOutputMap {
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

type GameEntityOpts = {
  key: string,
  engine: GameEngine,
  display: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  basePrice?: ContinuumEngine.CurrencyOpts,
}

interface GameEntityState extends ContinuumEngine.EntityState {
  basePrice?: ContinuumEngine.CurrencyOpts
}

export default class GameEntity extends Entity {
  /**
   * Custom class extending Continuum Entity.
   *
   */
  
  engine: GameEngine;
  state: GameEntityState;
  card;
  display;
  _showCard;

  constructor(type: string, opts: GameEntityOpts) {
    super(type, opts);
    this.engine = opts.engine;
    this.display = opts.display;
    this._showCard = false;

    this.state = {
      type: type,
      key: opts.key,
      count: opts.count || 0,
      maxCount: opts.maxCount || Number.MAX_VALUE,
      basePrice: opts.basePrice
    }

    const constructorCard = {
      key: opts.key,
      type: type,
      title: '',
      body: '',
    }
    this.card = new Proxy(constructorCard,
    {
      set: function(obj: cardObj, prop: keyof typeof constructorCard, newval: string) {
        const domObj = document.getElementById(`${obj['key']}-${obj['type']}-card-${prop}`);
        if (domObj) domObj.innerHTML = newval;
        obj[prop] = newval;

        return true;
      }
    });
  }

  set showCard(show: boolean) {
    this.toggleCard(show);
    this._showCard = show;
  }

  get showCard() {
    return this._showCard;
  }

  drawEntity(entityDomElement: HTMLElement, actionsDOM?: HTMLElement): HTMLElement {
    const entityContainer = document.createElement('div');

    const entityCardClone = document.getElementById('cds-card') as HTMLElement;
    const entityCard = entityCardClone.cloneNode() as HTMLElement;

    const cardLayout = document.createElement('div');
    const cardTitle = document.createElement('h4');
    const cardDivider1 = document.createElement('cds-divider');
    const cardDivider2 = document.createElement('cds-divider');
    const cardBody = document.createElement('div');
    const cardActions = document.createElement('div');
    const dismissAction = document.createElement('cds-button');

    dismissAction.setAttribute('action', 'flat-inline');
    dismissAction.innerHTML = 'Dismiss';
    dismissAction.addEventListener('click', () => this.showCard = false);
    cardActions.id = `${this.key}-${this.type}-card-actions`;
    cardActions.setAttribute('cds-layout', 'horizontal gap:lg align:vertical-center');
    cardActions.appendChild(dismissAction);
    if (actionsDOM) cardActions.appendChild(actionsDOM);
    cardDivider1.setAttribute('cds-card-remove-margin', 'true');
    cardDivider1.style.setProperty('--color', stringToColour(this.key));
    cardDivider2.setAttribute('cds-card-remove-margin', 'true');
    cardDivider2.style.setProperty('--color', stringToColour(this.key));
    cardBody.id = `${this.key}-${this.type}-card-body`;
    cardBody.setAttribute('cds-text', 'body secondary');
    cardBody.innerHTML = 'Body';
    cardTitle.id = `${this.key}-${this.type}-card-title`;
    cardTitle.setAttribute('cds-text', 'body message');
    cardTitle.innerHTML = 'Title';
    cardLayout.setAttribute('cds-layout', 'vertical gap:md');
    cardLayout.appendChild(cardTitle);
    cardLayout.appendChild(cardDivider1);
    cardLayout.appendChild(cardBody);
    cardLayout.appendChild(cardDivider2);
    cardLayout.appendChild(cardActions);
    entityCard.id = `${this.key}-${this.type}-card`;
    entityCard.style.zIndex = '999';
    entityCard.style.position = 'absolute';
    entityCard.style.setProperty('--width', '300px');
    entityCard.style.setProperty('--border', `var(--cds-alias-object-border-width-100, calc((1 / var(--cds-global-base, 20)) * 1rem)) solid ${stringToColour(this.key)}`);
    entityCard.appendChild(cardLayout);

    entityContainer.id = `${this.key}-${this.type}-container`;
    entityContainer.style.position = 'relative';
    if (this.count === 0) entityContainer.style.display = 'none';
    entityContainer.appendChild(entityDomElement);
    entityContainer.appendChild(entityCard);

    return entityContainer;
  }

  // If no parameter is sent, this will toggle the display, otherwise, parameter is a boolean determining display
  toggle(force?: boolean) {
    const entContainer = document.getElementById(`${this.key}-${this.type}-container`);

    if (entContainer) {
      const cardStatus = entContainer.style.getPropertyValue('display');

      if (typeof force === 'boolean'){
        force && entContainer.style.setProperty('display', 'block');
        force || entContainer.style.setProperty('display', 'none');
      } else {
        switch (cardStatus) {
          case '':
          case 'block':
            entContainer.style.setProperty('display', 'none');
            break;
          case 'none':
            entContainer.style.setProperty('display', 'block');
            break;
          default:
            break;
        }
      }
    }
  }

  toggleCard(force?: boolean) {
    const refreshCard = { ...this.card };
    this.card.key = '';
    this.card.type = '';
    this.card.title = '';
    this.card.body = '';

    this.card.key = refreshCard.key;
    this.card.type = refreshCard.type;
    this.card.title = refreshCard.title;
    this.card.body = refreshCard.body;

    const card = document.getElementById(`${this.key}-${this.type}-card`);

    if (card) {
      const cardStatus = card.style.getPropertyValue('display');

      const showOnlyThisCard = () => {
        card.style.setProperty('display', 'block');

        // Finagle the css to make sure the card is in the viewing window
        const viewPort = document.getElementById('pages-container') as HTMLElement;
        const cardWidth = 300;
        const cardStartx = card.getBoundingClientRect().x;
        const cardEndx = cardStartx + cardWidth;
        const viewPortEndx = viewPort.getBoundingClientRect().x + viewPort.clientWidth;
        const rightPad = 5;
        if (cardEndx > viewPortEndx) {
          card.style.left = (viewPortEndx - cardEndx - rightPad).toString() + 'px';
        }

        const types: ['resources', 'features', 'seeds'] = ['resources', 'features', 'seeds']
        types.forEach(entity => {
          for (const objKey in this.engine[entity]) {
            const obj = this.engine[entity][objKey];
            if (obj.key !== this.key) obj.showCard = false;
          }
        });

        for (const plotKey in this.engine.activeGarden().plots){
          const plot = this.engine.activeGarden().plots[plotKey];
          if (plot.key !== this.key) plot.showCard = false;
        }
      }

      if (typeof force === 'boolean'){
        force && showOnlyThisCard();
        force || card.style.setProperty('display', 'none');
      } else {
        switch (cardStatus) {
          case 'block':
            card.style.setProperty('display', 'none');
            break;
          case 'none':
            showOnlyThisCard();
            break;
          default:
            break;
        }
      }
    }
  }

}
