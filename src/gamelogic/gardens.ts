import { GardenOpts } from './classes/Garden';

type GardenList = {
  [key: string]: GardenOpts
}

export default {
  baby: {
    key: "baby",
    dimensions: {
      width: 1,
      height: 1
    },
    active: true
  },
  tiny: {
    key: "tiny",
    dimensions: {
      width: 2,
      height: 1
    },
    active: false
  }
} as GardenList