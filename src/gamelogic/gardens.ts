import { InitGardenOpts } from './classes/Garden';

type GardenList = {
  [key: string]: InitGardenOpts
}

export default {
  baby: {
    key: 'baby',
    display: 'Baby Garden',
    dimensions: {
      width: 1,
      height: 1
    },
    active: true
  },
  tiny: {
    key: "tiny",
    display: 'Tiny Garden',
    dimensions: {
      width: 2,
      height: 1
    },
    active: false
  }
} as GardenList