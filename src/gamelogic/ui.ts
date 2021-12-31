import Engine from '../../vendor/continuum/engine';

export default class UI {
  engine;
  rocksElem;

  constructor(engine: Engine) {
    this.engine = engine;
    this.rocksElem = document.getElementById("rocks");

    this.init();
  }

  init() {
    // this.engine.resources.rock
    //   .on("RESOURCE_COUNT_UPDATED", (e: any) => {
    //     console.log(e);
    //   })

  }

  update() {
    if (this.rocksElem) this.rocksElem.innerHTML = `Rocks: ${this.engine.formatNumber(this.engine.resources["rock"].count)}`;
  }
}