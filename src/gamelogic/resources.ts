import { ContinuumEngine } from './types/Continuum';

type resourceListType = {
  [key: string]: ContinuumEngine.ResourceOpts
}
export default{
  radish: {
    key: "radish",
    basePrice: {
      currency: "coin",
      amount: 2
    },
    count: 0
  }
} as resourceListType