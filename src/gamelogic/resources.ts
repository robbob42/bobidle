import { ContinuumEngine } from './types/Continuum';

type resourceListType = {
  [key: string]: ContinuumEngine.ResourceOpts
}
export default{
  rock: {
    key: "rock",
    basePrice: {
      currency: "gold",
      amount: 1
    },
    count: 0
  },
  clay: {
    key: "clay",
    basePrice: {
      currency: "gold",
      amount: 2
    },
    count: 0
  },
  fish: {
    key: "fish",
    basePrice: {
      currency: "gold",
      amount: 5
    },
    count: 0
  },
  tree: {
    key: "tree",
    basePrice: {
      currency: "gold",
      amount: 10
    },
    count: 0
  },
  grain: {
    key: "grain",
    basePrice: {
      currency: "gold",
      amount: 25
    },
    count: 0
  },
  zombie: {
    key: "zombie",
    basePrice: {
      currency: "gold",
      amount: 1
    },
    count: 1
  },
  activezombie: {
    key: "activezombie",
    basePrice: {
      currency: "gold",
      amount: 1
    },
    count: 0
  },
  power: {
    key: "power",
    basePrice: {
      currency: "gold",
      amount: 1
    },
    count: 0
  }
} as resourceListType