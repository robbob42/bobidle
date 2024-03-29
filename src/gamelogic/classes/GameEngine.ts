import Seed, { InitSeedOpts } from './Seed';
import Garden, { InitGardenOpts } from './Garden';
import Feature, { InitFeatureOpts } from './Feature';
import GameResource, { InitGameResourceOpts } from './GameResource';
import Engine from '../../../vendor/continuum/engine';
import { ContinuumEngine } from '../types/Continuum';
import Currency from '../../../vendor/continuum/currency';

interface MsgOpts {
  msg: {
    title: string,
    DomElement?: HTMLElement,
    body?: string
  }
  entity?: unknown,
  entityType?: string,
  callback?: () => void
}

export default class Gameengine extends Engine {
  /**
   * Custom class extending Continuum Engine.
   *
   */
  
  currencies: {
    [key: string]: ContinuumEngine.Currency;
  } = {};
  seeds: {
    [key: string]: Seed;
  } = {};
  resources: {
    [key: string]: GameResource;
  } = {};
  producers: {
    [key: string]: ContinuumEngine.Producer;
  } = {};
  gardens: {
    [key: string]: Garden
  } = {};
  features: {
    [key: string]: Feature
  } = {};
  selectedEntity: unknown;
  selectedEntityType: string | undefined;

  constructor() {
    super();
  }

  createCurrency(type: string, initialValue: number) {
    if ( !type ) throw `Invalid currency type provided ${type}`;
    if (!this.currencies[type]) {
      this.currencies[type] = new Currency(type, initialValue);
    }
    return this.currencies[type];
  }

  createSeed(opts: InitSeedOpts) {
    if ( !opts ) throw 'No resource options provided';
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.seeds[opts.key]) {
      const engineOpts = {
        ...opts,
        engine: this
      }
      this.seeds[opts.key] = new Seed(engineOpts);
    }
    return this.seeds[opts.key];
  }

  createGameResource(opts: InitGameResourceOpts) {
    if ( !opts ) throw 'No resource options provided';
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.resources[opts.key]) {
      const engineOpts = {
        ...opts,
        engine: this
      }
      this.resources[opts.key] = new GameResource(engineOpts);
    }
    return this.resources[opts.key];
  }

  createGarden(opts: InitGardenOpts) {
    if ( !opts ) throw 'No resource options provided';
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.gardens[opts.key]) {
      const engineOpts = {
        ...opts,
        engine: this
      }
      this.gardens[opts.key] = new Garden(engineOpts);
    }
    return this.gardens[opts.key];
  }

  createFeature(opts: InitFeatureOpts) {
    if ( !opts ) throw 'No resource options provided';
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.features[opts.key]) {
      const engineOpts = {
        ...opts,
        engine: this
      }
      this.features[opts.key] = new Feature(engineOpts);
    }
    return this.features[opts.key];
  }

  activeGarden(): Garden {
    const activeGarden = Object.entries(this.gardens).filter(([, garden]) => garden.active)[0];
    return this.gardens[activeGarden[0]];
  }

  setMessage(opts: MsgOpts) {
    const msgCard = document.getElementById('message-card');
    const msgTitle = document.getElementById('msg-title');
    const msgBody = document.getElementById('msg-body');

    let bgColor = '#AAAAAA';
    switch (opts.entityType) {
      case 'plot':
        bgColor = 'var(--cds-global-color-tan-900)';
        break;
      case 'seed':
        bgColor = 'var(--cds-global-color-blue-900)';
        break;
      case 'resource':
        bgColor = 'var(--cds-global-color-green-900)';
        break;
      default:
        break;
    }

    if (msgCard) {
      msgCard.style.display = '';
      msgCard.style.setProperty('--background', bgColor);
    }
    if (msgTitle) msgTitle.innerHTML = opts.msg.title;
    if (msgBody) msgBody.innerHTML = opts.msg.body || '';

    this.selectedEntity = opts.entity;
    this.selectedEntityType = opts.entityType;

    opts.callback && opts.callback();
  }

  unselect() {
    const msgDom = document.getElementById('message-card');
    const activeGarden = this.activeGarden();

    this.selectedEntity = {};
    this.selectedEntityType = '';

    if (msgDom) msgDom.style.display = 'none';

    activeGarden.highlightAvailablePlots(false);
  }
}