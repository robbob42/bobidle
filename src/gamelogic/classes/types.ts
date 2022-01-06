import Entity from '../../../vendor/continuum/entity';
import Engine from '../../../vendor/continuum/engine';
import Resource from '../../../vendor/continuum/resource';
import Producer from '../../../vendor/continuum/producer';
import Modifier from '../../../vendor/continuum/modifier';

// Entity
type requirementRuleMap = {
  [EntityKey: string]: number
}

export type requirementMap = {
  resources?: requirementRuleMap,
  producers?: requirementRuleMap
}

export type CalcDefObj = {
  source: Entity,
  calcFunc: (source: Entity) => number
}

export type entityOptsType = {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: requirementMap,
  engine?: Engine
}



// Currency
export type currencyOptsType = {
  currency: string,
  amount: number
}

// Resource
export type resourceOptsType = {
  key: string,
  basePrice?: currencyOptsType,
  calculated?: CalcDefObj,
  count?: number,
  maxCount?: number,
  requirements?: requirementMap
}

// Producer
type InputRequirement = {
  category: string,
  key: string,
  amount: number
}

type OutputRule = {
  productionAmount: number,
  productionTime: number,
  inputRequirements?: InputRequirement
}

export type OutputMap = {
  resources?: {
    [key: string]: OutputRule
  },
  producers?: {
    [key: string]: OutputRule
  }
}

type InputRule = {
  consumptionAmount: number,
  consumptionTime: number
}

export type InputMap = {
  resources: {
    [key: string]: InputRule,
  },
  producers: {
    [key: string]: InputRule,
  }
}

export type PostProcessorMap = {
  [key: string]: () => void
}

export type producerOptsType = {
  key: string,
  count?: number,
  maxCount?: number,
  baseCost?: currencyOptsType,
  costCoefficient?: number,
  outputs: OutputMap,
  inputs?: InputMap
  requirements?: requirementMap,
  postProcessors?: PostProcessorMap
}

// Reactor
export type reactorOptsType = {
  key: string,
  entityType: string,
  entityKey: string,
  basePrice?: currencyOptsType,
  count?: number,
  maxCount?: number
}

// Modifier
export type modifierOptsType = {
  key: string,
  applyFunc?: (entityType: string, entity: Entity) => void
  removeFunc?: (entityType: string, entity: Entity) => void
}

// EventEmitter
export type eventType = {
  [key: string]: Modifier
}

export type emitType = {
  obj: Resource | Producer,
  key: string,
  count: number,
  delta: number
}

// Seed
export type seedOptsType = {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: requirementMap,
  engine?: Engine
}
