// import { MDCSwitch } from '@material/switch';
import '@cds/core/button/register.js';
import '@cds/core/toggle/register.js';
import '@cds/core/card/register.js';

import Engine from '../../vendor/continuum/engine';
import Producer from '../../vendor/continuum/producer';
import Resource from '../../vendor/continuum/resource';
import { GameEngineType, JobTypes, ResourceTypes } from './game';
import { calcIdleZombies, assignZombie, unassignZombie } from './utils';

type outResource = {
  lastProcessed: number,
  productionTime: number,
  productionAmount: number
}

type resourceElemsType = {
  [key: string]: {
    countElem: HTMLElement
  }
}

type resourceEmitType = {
  obj: Resource,
  key: string,
  count: number,
  delta: number
}

type producerEmitType = {
  obj: Producer,
  key: string,
  count: number,
  delta: number
}


export default class UI {
  private _engine;
  private _zombiesElem;

  private _productionElem;

  private _warehouseElem;
  private _resourceElems;

  private _progressStyle;
  private _progressInnerspan;

  constructor(engine: Engine) {
    this._engine = engine as GameEngineType;

    this._zombiesElem = document.getElementById("zombies") as HTMLElement;

    this._productionElem = document.getElementById("production") as HTMLElement;

    this._warehouseElem = document.getElementById("warehouse") as HTMLElement;
    this._resourceElems = {} as resourceElemsType;

    this._progressStyle = document.createElement('style');
    this._progressInnerspan = document.getElementById("progress-inner-span") as HTMLElement;
  }

  init() {
    this._engine.resources.activezombie
      .on("RESOURCE_COUNT_UPDATED", () => {
        this._zombiesElem.innerHTML = `Idle Zombies: ${calcIdleZombies(this._engine)}`;

        for (const key in this._engine.producers) {
          const producer = this._engine.producers[key as JobTypes];

          const mySwitch = document.getElementById(`${key}-switch`) as HTMLInputElement;
          if (calcIdleZombies(this._engine) === 0) {
            if (!producer.processingEnabled) {
              mySwitch.disabled = true;
            }
          } else {
            mySwitch.disabled = false;
          }
        }
      });


    const button = document.querySelector('cds-button');
    if (button) button.action = 'outline';

    this._initProducerElements();
    this._initWarehouse();
  }

  update() {
    // const now = Date.now();
  }

  calculatePercentageComplete(now: number, outResource: outResource) {
    return (((now - outResource.lastProcessed) / outResource.productionTime)*100);
  }

  _removeProgressClass() {
    const headObjects = document.getElementsByTagName('head')[0];
    for (const obj in headObjects.children) {
      const inrHTML = headObjects.children[obj].innerHTML;
      if (inrHTML && inrHTML.substring(0, 9) === '.progress') {
        headObjects.removeChild(headObjects.children[obj]);
      }
    }
  }

  _addProgressClass(time: number) {
    const seconds = time / 1000;
    this._progressStyle = document.createElement('style');
    this._progressStyle.innerHTML = `.progress {
      background-color: #e4c465;
      -webkit-animation: progressBar ${seconds}s ease-in-out;
      -webkit-animation-fill-mode:both;
      -webkit-animation-iteration-count: infinite;
      -moz-animation: progressBar ${seconds}s ease-in-out;
      -moz-animation-fill-mode:both;
      -moz-animation-iteration-count: infinite;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(this._progressStyle);
  }

  _initWarehouse() {
    for (const key in this._engine.resources) {
      const resource = this._engine.resources[key as ResourceTypes];
      if (['rock', 'clay', 'fish', 'tree', 'grain'].includes(key)) {
        resource
          .on("RESOURCE_COUNT_UPDATED", (e: resourceEmitType) => {
            this._resourceElems[key].countElem.innerHTML = `${this._engine.formatNumber(e.count, 0)}`;
          });


        const s = document.createElement("span");
        s.id = `${key}-count`;
        this._resourceElems[key] = { countElem: s};
        const d = document.createElement("div");
        d.innerHTML = `${key.charAt(0).toUpperCase() + key.slice(1)} Count: `;
        d.appendChild(s);
        this._warehouseElem.appendChild(d);
      }
    }
  }

  _initProducerElements() {
    for (const key in this._engine.producers) {
      const producer = this._engine.producers[key as JobTypes];

      producer
      .on("PRODUCER_COUNT_UPDATED", (producer: producerEmitType) => {
        if (producer.obj.count === 1) {
          for (const outResource in producer.obj.outputs.resources) {
            this._addProgressClass(producer.obj.outputs.resources[outResource].productionTime);
            this._progressInnerspan.className = 'progress';
          }
        }
        if (producer.obj.count === 0) {
          this._removeProgressClass();
          this._progressInnerspan.className = '';
        }
      })

      const p = document.createElement("cds-toggle");
      p.id = `${key}-switch`;
      p.innerHTML = `
        <label>${key}</label>
        <input type="checkbox" />
      `;
      this._productionElem.appendChild(p);
      const mySwitch = document.getElementById(`${key}-switch`) as HTMLInputElement;

      const switchControl = () => {
        if(mySwitch.checked) {
          if(calcIdleZombies(this._engine) > 0) {
            assignZombie(this._engine, key as JobTypes);
          } else {
            mySwitch.checked = false;
          }
        } else {
          unassignZombie(this._engine, key as JobTypes);
        }
      }
      mySwitch.addEventListener("change", switchControl);

      const d = document.createElement("div");
      d.id = `${key}-pct`;
      this._productionElem.appendChild(d);

      const b = document.createElement("br");
      this._productionElem.appendChild(b);
    }
  }
}