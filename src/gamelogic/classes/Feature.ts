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
  /**
   * Custom class extending Continuum Entity.
   *
   * @param opts - Object containing default values for this Feature.  Type definition above.
   *
   */
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
    /**
     * `incrementBy` is the function that will be called to add this feature to the game
     *
     * @param val - The number to increment.  For features, this will almost always be irrelevant
     * 
     */
    
    const parent = document.getElementById(this.parentId) as HTMLElement;

    // Determine where this feature is going to be place in the game based on which parameters
    // were sent in the intial constructor
    //    firstChildId: Will select the DOM element by ID, and add this feature as the first child of that element
    //    replaceId: Will select the DOM element by ID, and replace it with this feature
    //    everything else: Will select the DOM element by ID, and add this feature as the last child of that element
    if (this.firstChildId) {
      const parent = document.getElementById(this.parentId) as HTMLElement;
      parent.insertBefore(this.domElement, parent.firstChild);
    } else if (this.replaceId) {
      const replaceElement = document.getElementById(this.replaceId) as HTMLElement;
      parent.replaceChild(this.domElement, replaceElement);
    } else {
      parent.appendChild(this.domElement);
    }

    // In case this feature is a new tab, navigate to that tab
    switch (this.key) {
      case 'navigation':
        navigate('home');
        break;

      case 'basket':
        navigate(this.key);
        break;

      case 'bank':
        break;

      case 'market':
        navigate(this.key);
        break;

      default:
        break;
    }

    return super.incrementBy(val);
  }
}