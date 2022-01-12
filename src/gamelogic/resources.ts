import { ContinuumEngine } from './types/Continuum';

type resourceListType = {
  [key: string]: ContinuumEngine.ResourceOpts
}
export default{
  rock: {
    key: "radish",
    basePrice: {
      currency: "gold",
      amount: 1
    },
    count: 0
  }
} as resourceListType