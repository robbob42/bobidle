import { FeatureOpts } from './classes/Feature';

// First Seed
const firstSeedDom = document.createElement('span');

type FeatureList = {
  [key: string]: FeatureOpts
}

export default {
  firstSeed: {
    key: 'firstseed',
    parentId: 'feature-first-seed',
    domElement: firstSeedDom,
    visible: true
  }
} as FeatureList