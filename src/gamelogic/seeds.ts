import { InitSeedOpts } from './classes/Seed';
import { stringToColour } from '../gamelogic/utils';


type FeatureList = {
  [key: string]: InitSeedOpts
}

export default {
  navigation: {
    key: 'navigation',
    display: 'Navigation Seed',
    productionTime: 3000,
    outputs: {
      features: {
        navigation: {
          productionAmount: 1
        }
      },
      seeds: {
        basket: {
          productionAmount: 1
        }
      }
    },
    tooltip: {
      body: 'Missing an Inventory?  This should do the trick!'
    },
    color: stringToColour('navigation'),
    count: 1
  },
  basket: {
    key: 'basket',
    display: 'Basket Seed',
    productionTime: 3000,
    outputs: {
      features: {
        basket: {
          productionAmount: 1
        }
      },
      seeds: {
        bank: {
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
  bank: {
    key: 'bank',
    display: 'Bank Seed',
    productionTime: 3000,
    outputs: {
      features: {
        bank: {
          productionAmount: 1
        }
      },
      seeds: {
        market: {
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
  market: {
    key: 'market',
    display: 'Market Seed',
    productionTime: 3000,
    outputs: {
      features: {
        market: {
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
    display: 'Market Upgrade: Buy',
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
    display: 'Market Upgrade: Sell',
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
    display: 'Radish Seed',
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