import Seed, { SeedOpts } from './Seed';
import Garden, { InitGardenOpts } from './Garden';
import Feature, { FeatureOpts } from './Feature';
import Engine from '../../../vendor/continuum/engine';
import { ContinuumEngine } from '../types/Continuum';

interface MsgOpts {
  msg: string,
  entity?: unknown,
  entityType?: string,
  callback?: () => void,
  status?: string
}

export default class Gameengine extends Engine {
  seeds: {
    [key: string]: Seed;
  } = {};
  resources: {
    [key: string]: ContinuumEngine.Resource;
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

  createSeed(opts: SeedOpts) {
    if ( !opts ) throw 'No resource options provided';
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.seeds[opts.key]) {
        opts.engine = this;
        this.seeds[opts.key] = new Seed(opts);
    }
    return this.seeds[opts.key];
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

  createFeature(opts: FeatureOpts) {
    if ( !opts ) throw 'No resource options provided';
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.features[opts.key]) {
        opts.engine = this;
        this.features[opts.key] = new Feature(opts);
    }
    return this.features[opts.key];
  }

  activeGarden(): Garden {
    const activeGarden = Object.entries(this.gardens).filter(([, garden]) => garden.active)[0];
    return this.gardens[activeGarden[0]];
  }

  setMessage(opts: MsgOpts) {
    const msgDom = document.getElementById('body-message') as HTMLElement;
    const msgContainerDom = document.getElementById('body-message-container') as HTMLElement;
    const msgBlankDom = document.getElementById('body-message-blank') as HTMLElement;

    msgBlankDom.style.display = 'none';
    msgContainerDom.style.display = 'block';
    this.selectedEntity = opts.entity;
    this.selectedEntityType = opts.entityType;

    opts.callback && opts.callback();
    opts.status && msgDom.setAttribute('status', opts.status);
    msgDom.innerHTML = opts.msg;
  }

  unselect() {
    const msgDom = document.getElementById('body-message') as HTMLElement;
    const msgContainerDom = document.getElementById('body-message-container') as HTMLElement;
    const msgBlankDom = document.getElementById('body-message-blank') as HTMLElement;
    const activeGarden = this.activeGarden();

    msgBlankDom.style.display = 'block';
    msgContainerDom.style.display = 'none';
    this.selectedEntity = {};
    this.selectedEntityType = '';

    msgDom.innerHTML = '';

    activeGarden.highlightAvailablePlots(false);
  }
}