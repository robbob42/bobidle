import '@cds/core/toggle/register.js';
import '@cds/core/card/register.js';
import '@cds/core/divider/register.js';

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

type producerElemsType = {
  [key: string]: {
    progressElem: HTMLElement
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
  private _producerElems;

  private _warehouseElem;
  private _resourceElems;

  private _progressStyle;
  private _progressInnerspan;

  constructor(engine: Engine) {
    this._engine = engine as GameEngineType;

    this._zombiesElem = document.getElementById("zombies") as HTMLElement;

    this._productionElem = document.getElementById("production") as HTMLElement;
    this._producerElems = {} as producerElemsType;

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

    this._initProducerElements();
    this._initWarehouse();
  }

  update() {
    // const now = Date.now();
  }

  calculatePercentageComplete(now: number, outResource: outResource) {
    return (((now - outResource.lastProcessed) / outResource.productionTime)*100);
  }

  _removeProgressClass(producerName: string) {
    const headObjects = document.getElementsByTagName('head')[0];
    const producerClass = `.${producerName}-progress`;
    for (const obj in headObjects.children) {
      const inrHTML = headObjects.children[obj].innerHTML;
      if (inrHTML && inrHTML.substring(0, producerClass.length) === producerClass) {
        headObjects.removeChild(headObjects.children[obj]);
      }
    }
  }

  _addProgressClass(producerName: string, time: number) {
    const seconds = time / 1000;
    this._progressStyle = document.createElement('style');
    this._progressStyle.innerHTML = `.${producerName}-progress {
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
            this._addProgressClass(key, producer.obj.outputs.resources[outResource].productionTime);
            this._producerElems[key].progressElem.children[0].children[0].className = `${key}-progress`;
          }
        }
        if (producer.obj.count === 0) {
          this._removeProgressClass(key);
          this._producerElems[key].progressElem.children[0].children[0].className = '';
        }
      });

      const s = document.createElement("cds-toggle");
      s.id = `${key}-switch`;
      s.innerHTML = `
        <label>${key}</label>
        <input type="checkbox" />
      `;

      const p = document.createElement("div");
      p.id = `${key}-animating-progress`;
      p.className = 'meter';
      p.innerHTML = `
        <span style="width:100%;"><span id="progress-inner-span" class="${key}-progress"></span></span>
      `;

      this._producerElems[key] = { progressElem: p};

      const c = document.getElementById("cds-card") as HTMLElement;
      const cln = c.cloneNode(true) as HTMLElement;
      cln.id = `${key}-card`;
      cln.innerHTML = `
        <div cds-layout="vertical gap:md" name="outer-div">
          <div cds-text="body light" cds-layout="p-y:md" name="switch-container"></div>
        </div>
      `;

      cln.children.namedItem('outer-div')?.children.namedItem('switch-container')?.appendChild(p);
      cln.children.namedItem('outer-div')?.children.namedItem('switch-container')?.appendChild(s);
      this._productionElem.appendChild(cln);
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