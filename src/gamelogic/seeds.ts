import { InitSeedOpts } from './classes/Seed';
import { stringToColour } from '../gamelogic/utils';


type FeatureList = {
  [key: string]: InitSeedOpts
}

export default {
  firstSeed: {
    key: 'InventoryTab',
    productionTime: 3000,
    baseCost: {
      currency: 'gold',
      amount: 1
    },
    outputs: {
      features: {
        lowerhalf: {
          productionAmount: 1
        }
      },
      seeds: {
        resourceTab: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'Missing an Inventory?  This should do the trick!'
    },
    color: stringToColour('InventoryTab'),
    count: 1
  },
  resourceTab: {
    key: 'resourceTab',
    productionTime: 3000,
    baseCost: {
      currency: 'gold',
      amount: 1
    },
    outputs: {
      features: {
        resourceTab: {
          productionAmount: 1
        }
      },
      seeds: {
        moneyTab: {
          productionAmount: 1
        }
      },
      resources: {
        radish: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'That Inventory looks awefully lonely, how \'bout some company?'
    },
    color: stringToColour('resourceTab'),
    count: 0
  },
  moneyTab: {
    key: 'moneyTab',
    productionTime: 3000,
    baseCost: {
      currency: 'gold',
      amount: 1
    },
    outputs: {
      features: {
        moneyTab: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'Who wants to start generating money?'
    },
    color: stringToColour('moneyTab'),
    count: 0
  },
  radish: {
    key: 'radish',
    productionTime: 3000,
    baseCost: {
      currency: 'gold',
      amount: 1
    },
    outputs: {
      resources: {
        radish: {
          productionAmount: 1
        }
      }
    },
    color: stringToColour('radish'),
    count: 0
  }
} as FeatureList