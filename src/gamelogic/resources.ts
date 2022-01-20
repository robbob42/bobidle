import { InitGameResourceOpts } from './classes/GameResource';

type resourceListType = {
  [key: string]: InitGameResourceOpts
}
export default{
  radish: {
    key: "radish",
    display: 'Radish',
    basePrice: {
      currency: "coin",
      amount: 2
    },
    count: 0
  }
} as resourceListType