import Entity from "../../../vendor/continuum/entity";
import GameEngine from './GameEngine';
import { ContinuumEngine } from '../types/Continuum';

export interface cardObj {
  key: string,
  type: string,
  title: string,
  body: string,
  actions: string
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

// The sole purpose for this class is to ensure that 'engine' is types as the custom GameEngine.
// In all other aspects, this just mimics the Continuum Entity
export default class GameEntity extends Entity {
  engine: GameEngine;
  state: GameEntityState;
  card;
  display;

  constructor(type: string, opts: GameEntityOpts) {
    super(type, opts);
    this.engine = opts.engine;
    this.display = opts.display;

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
      actions: ''
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

  drawEntity(entityDomElement: HTMLElement): HTMLElement {
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
    cardActions.id = `${this.key}-${this.type}-card-actions`;
    cardActions.setAttribute('cds-layout', 'horizontal gap:lg align:vertical-center');
    cardActions.appendChild(dismissAction);
    cardDivider1.setAttribute('cds-card-remove-margin', 'true');
    cardDivider2.setAttribute('cds-card-remove-margin', 'true');
    cardBody.id = `${this.key}-${this.type}-card-body`;
    cardBody.setAttribute('cds-text', 'body light');
    cardBody.innerHTML = 'Body';
    cardTitle.id = `${this.key}-${this.type}-card-title`;
    cardTitle.setAttribute('cds-text', 'section');
    cardTitle.innerHTML = 'Title';
    cardLayout.setAttribute('cds-layout', 'vertical gap:md');
    cardLayout.appendChild(cardTitle);
    cardLayout.appendChild(cardDivider1);
    cardLayout.appendChild(cardBody);
    cardLayout.appendChild(cardDivider2);
    cardLayout.appendChild(cardActions);
    entityCard.id = `${this.key}-${this.type}-card`;
    entityCard.style.setProperty('--width', '100%');
    entityCard.appendChild(cardLayout);

    entityContainer.appendChild(entityDomElement);
    entityContainer.appendChild(entityCard);

    return entityContainer;
  }

  toggleCard(msg: cardObj) {
    this.card.title = msg.title;
    this.card.body = msg.body;

    const card = document.getElementById(`${this.key}-${this.type}-card`);

    if (card) {
      const cardStatus = card.style.getPropertyValue('display');
      switch (cardStatus) {
        case 'block':
          card.style.setProperty('display', 'none');
          break;
        case 'none':
          card.style.setProperty('display', 'block');
          break;
        default:
          break;
      }
    }

    // const msgCard = document.getElementById('message-card');
    // const msgTitle = document.getElementById('msg-title');
    // const msgBody = document.getElementById('msg-body');

    // let bgColor = '#AAAAAA';
    // switch (opts.entityType) {
    //   case 'plot':
    //     bgColor = 'var(--cds-global-color-tan-900)';
    //     break;
    //   case 'seed':
    //     bgColor = 'var(--cds-global-color-blue-900)';
    //     break;
    //   case 'resource':
    //     bgColor = 'var(--cds-global-color-green-900)';
    //     break;
    //   default:
    //     break;
    // }

    // if (msgCard) {
    //   msgCard.style.display = '';
    //   msgCard.style.setProperty('--background', bgColor);
    // }
    // if (msgTitle) msgTitle.innerHTML = opts.msg.title;
    // if (msgBody) msgBody.innerHTML = opts.msg.body || '';

    // opts.callback && opts.callback();
    // if (opts.msg.DomElement) {
    //   msgDom.appendChild(opts.msg.DomElement);
    // }
  }

}
