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
        moneyDisplay: {
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
  moneyDisplay: {
    key: 'moneyDisplay',
    productionTime: 3000,
    baseCost: {
      currency: 'gold',
      amount: 1
    },
    outputs: {
      currencies: {
        coin: {
          productionAmount: 1
        }
      },
      features: {
        moneyDisplay: {
          productionAmount: 1
        }
      },
      seeds: {
        marketTab: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'A great way to view your money!'
    },
    color: stringToColour('moneyDisplay'),
    count: 0
  },
  marketTab: {
    key: 'marketTab',
    productionTime: 3000,
    baseCost: {
      currency: 'gold',
      amount: 1
    },
    outputs: {},
    tooltip: {
      body: 'Ready to start buying and selling?'
    },
    color: stringToColour('marketTab'),
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