import { MDCSwitch } from '@material/switch';

import Engine from '../../vendor/continuum/engine';
import { GameEngineType } from './game';
import { incrementActiveZombies } from './utils';


export default class UI {
  engine;
  rocksElem;

  constructor(engine: Engine) {
    this.engine = engine as GameEngineType;
    this.rocksElem = document.getElementById("rocks") as HTMLElement;

    this.init();
  }

  init() {
    // this.engine.resources.rock
    //   .on("RESOURCE_COUNT_UPDATED", (e: any) => {
    //     console.log(e);
    //   })


    // Resources
    const rockSwitchDOM = document.getElementById('rocks-switch') as HTMLButtonElement;
    const rockSwitch = new MDCSwitch(rockSwitchDOM);
    const rockSwitchControl = () => {
      if(rockSwitch.selected) {
        this.engine.producers.miner.incrementBy(1);
        this.engine.producers.miner.processingEnabled = true;
        incrementActiveZombies(this.engine, 1);
      } else {
        this.engine.producers.miner.incrementBy(-1);
        incrementActiveZombies(this.engine, -1);
        this.engine.producers.miner.processingEnabled = false;
      }
    }
    rockSwitchDOM?.addEventListener("click", rockSwitchControl);
  }

  update() {
    this.rocksElem.innerHTML = `Rocks: ${this.engine.formatNumber(this.engine.resources["rock"].count)}`;
  }
}