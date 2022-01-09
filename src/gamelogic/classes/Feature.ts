import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';


export interface FeatureOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine?: ContinuumEngine.Engine,
  parentId: string,
  domElement: HTMLElement,
  visible: boolean
}

export default class Feature extends Entity {
  parentId;
  domElement;
  visible;

  constructor(opts: FeatureOpts) {
    super("feature", opts);

    this.parentId = opts.parentId;
    this.domElement = opts.domElement;
    this.visible = opts.visible;
  }
}