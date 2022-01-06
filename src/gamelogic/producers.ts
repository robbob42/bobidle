import { producerOptsType } from '../../vendor/continuum/producer';

type producerListType = {
  [key: string]: producerOptsType
}

export default {
  miner: {
    key: "miner",
    outputs: {
      resources: {
        rock: {
          productionTime: 1000,
          productionAmount: 1
        }
      }
    },
    count: 0,
    processingEnabled: false
  },
  mucker: {
    key: "mucker",
    outputs: {
      resources: {
        clay: {
          productionTime: 1500,
          productionAmount: 1
        }
      }
    },
    count: 0,
    processingEnabled: false
  },
  fisher: {
    key: "fisher",
    outputs: {
      resources: {
        fish: {
          productionTime: 2000,
          productionAmount: 1
        }
      }
    },
    count: 0,
    processingEnabled: false
  },
  arborist: {
    key: "arborist",
    outputs: {
      resources: {
        tree: {
          productionTime: 2500,
          productionAmount: 1
        }
      }
    },
    count: 0,
    processingEnabled: false
  },
  farmer: {
    key: "farmer",
    outputs: {
      resources: {
        grain: {
          productionTime: 3000,
          productionAmount: 1
        }
      }
    },
    count: 0,
    processingEnabled: false
  }
} as producerListType