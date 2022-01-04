import { MDCSwitch } from '@material/switch';

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
    this._engine.resources.zombie
      .on("RESOURCE_COUNT_UPDATED", (e: resourceEmitType) => {
        this._zombiesElem.innerHTML = `Zombies: ${this._engine.formatNumber(e.count, 0)}`;
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

      const p = document.createElement("button");
      p.id = `${key}-switch`;
      p.className = 'mdc-switch mdc-switch--unselected';
      p.ariaRoleDescription = 'switch';
      p.ariaChecked = 'false';
      p.innerHTML = `
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__handle-track">
          <div class="mdc-switch__handle">
            <div class="mdc-switch__shadow">
              <div class="mdc-elevation-overlay"></div>
            </div>
            <div class="mdc-switch__ripple"></div>
            <div class="mdc-switch__icons">
              <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
              </svg>
              <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
                <path d="M20 13H4v-2h16v2z" />
              </svg>
            </div>
          </div>
        </div>
      `;
      const materialSwitch = new MDCSwitch(p);
      const switchControl = () => {
        if(materialSwitch.selected) {
          if(calcIdleZombies(this._engine) > 0) {
            assignZombie(this._engine, key as JobTypes);
          } else {
            materialSwitch.selected = false;
          }
        } else {
          unassignZombie(this._engine, key as JobTypes);
        }
      }
      p.addEventListener("click", switchControl);
      this._productionElem.appendChild(p);

      const l = document.createElement("label");
      l.setAttribute('for', `${key}-switch`);
      l.innerHTML = key;
      this._productionElem.appendChild(l);

      const d = document.createElement("div");
      d.id = `${key}-pct`;
      this._productionElem.appendChild(d);

      const b = document.createElement("br");
      this._productionElem.appendChild(b);
    }
  }
}