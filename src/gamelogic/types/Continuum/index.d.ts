export namespace ContinuumEngine {
  // General
  interface InputRequirement {
    category: string,
    key: string,
    amount: number
  }

  interface OutputRule {
    productionAmount: number,
    productionTime: number,
    inputRequirements?: InputRequirement
  }

  interface OutputMap {
    resources?: {
      [key: string]: OutputRule
    },
    producers?: {
      [key: string]: OutputRule
    }
  }

  interface InputRule {
    consumptionAmount: number,
    consumptionTime: number
  }

  interface InputMap {
    resources: {
      [key: string]: InputRule,
    },
    producers: {
      [key: string]: InputRule,
    }
  }

  interface PostProcessorMap {
    [key: string]: () => void
  }

  interface CalcDefObj {
    source: Entity,
    calcFunc: (source: Entity) => number
  }


  // Engine
  interface Engine {
    lastTick: number;
    lastSave: number;
    currencies: {
      [key: string]: Currency;
    };
    producers: {
      [key: string]: Producer;
    };
    resources: {
      [key: string]: Resource;
    };
    modifiers: {
      [key: string]: Modifier;
    };
    reactors: {
      [key: string]: Reactor;
    };
    activeModifiers: Modifier[];
    numberFormatter: (val: number, decimals: number) => string;
    autosavePeriod: number;
    createCurrency(opts: CurrencyOpts): Currency;
    currency(type: string): Currency;
    createProducer(opts: ProducerOpts): Producer;
    destroyProducer(key: string): void;
    producer(key: string): Producer;
    createResource(opts: ResourceOpts): Resource;
    resource(key: string): Resource;
    createModifier(opts: ModifierOpts): Modifier;
    modifier(key: string): Modifier;
    createReactor(opts: ReactorOpts): Reactor;
    reactor(key: string): Reactor;
    activateModifier(key: string, opts: {timeleft: number}): void;
    onTick(dt: number): void;
    autoSave(dt: number): void;
    saveState(): void;
    loadState(): void;
    processProducers(dt: number): void;
    processResources(dt: number): void;
    processModifiers(dt: number): void;
    setNumberFormatter(type: string): void;
    formatNumber(n: number, decimals?: number): string;
  }


  // Entity
  interface RequirementRuleMap {
    [EntityKey: string]: number
  }

  interface RequirementMap {
    resources?: RequirementRuleMap,
    producers?: RequirementRuleMap
  }

  interface EntityState {
    type: string;
    key: string;
    count: number;
    maxCount: number;
  }

  interface Entity extends EventEmitter {
    state: EntityState;
    requirements: RequirementMap;
    lastProcessed: number;
    engine: Engine;
    get type(): string;
    get key(): string;
    get count(): number;
    get maxCount(): number;
    serialise(): EntityState;
    deserialise(o: EntityState): void;
    incrementBy(val: number): number;
    requirementsMet(): boolean;
    onTick(dt: number): void;
    processTick(dt: number): void;
    canProcess(dt: number): boolean;
  }


  // Currency
  interface CurrencyOpts {
    currency: string,
    amount: number
  }

  interface CurrencyState {
    type: string;
    value: number;
  }

  interface Currency extends EventEmitter {
    state: CurrencyState;
    set value(arg: number);
    get value(): number;
    get type(): string;
    serialise(): CurrencyState;
    deserialise(o: CurrencyState): void;
    incrementBy(value: number): void;
  }


  // Producer
  interface ProducerOpts {
    key: string,
    count?: number,
    maxCount?: number,
    baseCost?: CurrencyOpts,
    costCoefficient?: number,
    outputs: OutputMap,
    inputs?: InputMap
    requirements?: RequirementMap,
    postProcessors?: PostProcessorMap
  }

  interface Producer extends Entity {
    inputs: InputMap;
    outputs: OutputMap;
    postProcessors: PostProcessorMap;
    get baseCost(): CurrencyOpts;
    get costCoefficient(): number;
    get consumedInputs(): InputMap;
    set processingEnabled(arg: boolean);
    get processingEnabled(): boolean;
    resetTimers(): void;
    calculateCost(count: number): {
        currency: Currency;
        price: number;
    };
    addOutput(outputType: string, outputKey: string, productionTime: number, productionAmount: number): Producer;
    getOutput(outputType: string, outputKey: string): Producer;
    processTick(dt: number): void;
  }


  // Resource
  interface ResourceOpts {
    key: string,
    basePrice?: CurrencyOpts,
    calculated?: CalcDefObj,
    count?: number,
    maxCount?: number,
    requirements?: RequirementMap
  }

  interface Resource extends Entity {
    calculated: CalcDefObj;
    get basePrice(): CurrencyOpts;
    calculatePrice(amountToSell: number): {
        currency: string;
        amount: number;
    };
    processTick(dt: number): void;
  }


  // Modifier
  interface ModifierOpts {
    key: string,
    applyFunc?: (entityType: string, entity: Entity) => void
    removeFunc?: (entityType: string, entity: Entity) => void
  }

  interface Modifier {
    state: {
        key: string;
    };
    apply: (entityType: string, entity: Entity) => void;
    remove: (entityType: string, entity: Entity) => void;
  }


  // Reactor
  interface ReactorOpts {
    key: string,
    entityType: string,
    entityKey: string,
    basePrice?: CurrencyOpts,
    count?: number,
    maxCount?: number
  }

  interface ReactorState {
    key: string;
    entityType: string;
    entityKey: string;
    basePrice: CurrencyOpts;
    count: number;
    maxCount: number;
  }

  interface Reactor {
    state: ReactorState;
    engine: Engine;
    get key(): string;
    get entityType(): string;
    get entityKey(): string;
    get basePrice(): CurrencyOpts;
    get count(): number;
    get entity(): number;
    purchase(): boolean;
  }


  // Eventemitter
  interface EventEmitter {
    events: Event;
    on(event: string, listener: (e: Emit) => void): () => void;
    off(event: string): void;
    removeListener(event: string, listener: () => void): void;
    emit(event: string, args: Entity): void;
    once(event: string, listener: Modifier): void;
  }

  interface Event {
    [key: string]: Modifier
  }

  interface Emit {
    obj: Resource | Producer,
    key: string,
    count: number,
    delta: number
  }
}
