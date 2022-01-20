import { InitSeedOpts } from './classes/Seed';
import { stringToColour } from '../gamelogic/utils';


type FeatureList = {
  [key: string]: InitSeedOpts
}

export default {
  firstSeed: {
    key: 'InventoryTab',
    display: 'Inventory',
    productionTime: 3000,
    outputs: {
      features: {
        lowerHalf: {
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
    display: 'Resources',
    productionTime: 3000,
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
    display: 'Bank',
    productionTime: 3000,
    outputs: {
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
    display: 'Market',
    productionTime: 3000,
    outputs: {
      features: {
        marketTab: {
          productionAmount: 1
        }
      },
      seeds: {
        marketUpg1: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'Ready to start buying and selling?'
    },
    color: stringToColour('marketTab'),
    count: 0
  },
  marketUpg1: {
    key: 'marketUpg1',
    display: 'Market - Buy Upgrade',
    productionTime: 3000,
    outputs: {
      features: {
        marketBuyTab: {
          productionAmount: 1
        }
      },
      seeds: {
        marketUpg2: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'Can\'t do much with that market.  Let\'s upgrade it!'
    },
    color: stringToColour('marketUpg1'),
    count: 0
  },
  marketUpg2: {
    key: 'marketUpg2',
    display: 'Market - Sell Upgrade',
    productionTime: 3000,
    outputs: {
      features: {
        marketSellTab: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'Still not happy with your market?  Keep upgrading!'
    },
    color: stringToColour('marketUpg1'),
    count: 0
  },
  radish: {
    key: 'radish',
    display: 'Radish',
    productionTime: 3000,
    baseCost: {
      currency: 'coin',
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