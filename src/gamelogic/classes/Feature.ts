import GameEntity from './GameEntity';
import { ContinuumEngine } from '../types/Continuum';
import Gameengine from './GameEngine';
import { navigate, updateMarketSell, updateMarketBuy } from '../utils';


export interface InitFeatureOpts {
  key: string,
  display: string,
  parentId: string,
  domElement: HTMLElement,
  visible: boolean,
  replaceId?: string,
  firstChildId?: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap
}

export type FeatureOpts = InitFeatureOpts & {
  engine: Gameengine,
}

export interface EmitFeatureUnlocked {
  feature: Feature
}

export default class Feature extends GameEntity {
  display;
  parentId;
  domElement;
  visible;
  replaceId;
  firstChildId;

  constructor(opts: FeatureOpts) {
    super("feature", opts);

    this.display = opts.display;
    this.parentId = opts.parentId;
    this.domElement = opts.domElement;
    this.visible = opts.visible;
    this.replaceId = opts.replaceId || null;
    this.firstChildId = opts.firstChildId || null;
  }

  incrementBy(val: number): number {
    const parent = document.getElementById(this.parentId) as HTMLElement;
    if (this.firstChildId) {
      const parent = document.getElementById(this.parentId) as HTMLElement;
      parent.insertBefore(this.domElement, parent.firstChild);
    } else if (this.replaceId) {
      const replaceElement = document.getElementById(this.replaceId) as HTMLElement;
      parent.replaceChild(this.domElement, replaceElement);
    } else {
      parent.appendChild(this.domElement);
    }

    // Update Inventory in case the inventory was just unlocked
    switch (this.key) {
      case 'navigation':
        // this.engine.seeds['basket'].incrementBy(1);
        navigate('home');
        break;

      case 'basket':
        // this.engine.seeds['bank'].incrementBy(1);
        navigate(this.key);
        break;

      case 'bank':
        // this.engine.seeds['market'].incrementBy(1);
        break;

      case 'market':
        navigate(this.key);
        break;

      default:
        break;
    }

    if (this.key === 'marketBuyTab' || this.key === 'marketSellTab') {
      const marketClick = () => {
        const marketNav = document.getElementById('market-group');
        if (marketNav?.getAttribute('expanded') === 'true') {
          marketNav?.setAttribute('expanded', 'false');
        } else {
          marketNav?.setAttribute('expanded', 'true');
        }
      }
      const market = document.getElementById('market');
      market?.addEventListener('click', marketClick);
    }

    if (this.key === 'marketBuyTab') {
      for (const seedKey in this.engine.seeds) {
        const seed = this.engine.seeds[seedKey];

        if (seed.baseCost) {
          updateMarketBuy(seed);
        }
      }

      navigate('buy');
    }

    if (this.key === 'marketSellTab') {
      for (const resourceKey in this.engine.resources) {
        const resource = this.engine.resources[resourceKey];

        if (resource.basePrice) {
          updateMarketSell(resource);
        }
      }
      navigate('sell');
    }

    return super.incrementBy(val);
  }
}