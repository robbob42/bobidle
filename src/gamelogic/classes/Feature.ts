import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';
import Gameengine from './GameEngine';


export interface InitFeatureOpts {
  key: string,
  parentId: string,
  domElement: HTMLElement,
  visible: boolean,
  replaceId?: string,
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

export default class Feature extends Entity {
  parentId;
  domElement;
  visible;
  replaceId;

  constructor(opts: FeatureOpts) {
    super("feature", opts);

    this.parentId = opts.parentId;
    this.domElement = opts.domElement;
    this.visible = opts.visible;
    this.replaceId = opts.replaceId || null;
  }

  incrementBy(val: number): number {
    this.emit("FEATURE_UNLOCKED", {
      feature: this
    });
    return val;
  }
}