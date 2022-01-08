import Entity from '../../../vendor/continuum/entity';
import { ContinuumEngine } from '../types/Continuum';
import Plot, { PlotOpts } from './Plot';


interface GardenDimensions {
  width: number,
  height: number
}

export interface GardenOpts {
  key: string,
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
  engine?: ContinuumEngine.Engine,
  dimensions: GardenDimensions,
  active: boolean
}

export default class Garden extends Entity {
  dimensions: GardenDimensions;
  active: boolean;
  plots: {
    [key: string]: Plot
  } = {}

  constructor(opts: GardenOpts) {
    super("seed", opts);

    this.dimensions = opts.dimensions;
    this.active = opts.active;
    this.plots = {};
  }

  drawGarden(): HTMLElement {
    const gridCols = 12 / this.dimensions.width;
    const d = document.createElement('div');
    d.setAttribute('cds-layout', 'grid');

    let plotId = 1;

    for (let i = 1; i <= this.dimensions.height; i++) {
      for (let i = 1; i <= this.dimensions.width; i++) {
        // Create Plot object and attach it to this Garden
        const plot = this.createPlot({key: plotId.toString()});

        // Attach Plot to DOM
        const DOMplot = plot.drawPlot(gridCols, plotId);
        d.appendChild(DOMplot);
        plotId++;
      }
    }
    return d;
  }

  createPlot(opts: PlotOpts) {
    if ( !opts ) throw "No resource options provided";
    if ( !opts.key ) throw `Invalid resource .key value provided ${opts.key}`;
    if (!this.plots[opts.key]) {
        opts.engine = this.engine;
        this.plots[opts.key] = new Plot(opts);
    }
    return this.plots[opts.key];
  }

  plot(key: string) {
    return this.plots[key];
  }
}