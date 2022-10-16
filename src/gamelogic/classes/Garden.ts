import GameEntity from './GameEntity';
import { ContinuumEngine } from '../types/Continuum';
import Plot, { PlotOpts } from './Plot';
import GameEngine from './GameEngine';


interface GardenDimensions {
  width: number,
  height: number
}

export interface InitGardenOpts {
  key: string,
  display: string,
  dimensions: GardenDimensions,
  active: boolean
  count?: number,
  maxCount?: number,
  requirements?: ContinuumEngine.RequirementMap,
}

export type GardenOpts = InitGardenOpts & {
  engine: GameEngine,
}

export default class Garden extends GameEntity {
  /**
   * Custom class extending Continuum Entity.
   *
   * @param opts - Object containing default values for this Garden.  Type definition above.
   * 
   */
  
  dimensions: GardenDimensions;
  active: boolean;
  plots: {
    [key: string]: Plot
  } = {};

  constructor(opts: GardenOpts) {
    super("seed", opts);

    this.dimensions = opts.dimensions;
    this.active = opts.active;
    this.plots = {};
  }

  drawGarden(): HTMLElement {
    /**
     * Draw the DOM UI element that will represent this garden
     *
     */
    
    const gridCols = 12 / this.dimensions.width;
    const d = document.createElement('div');
    d.id = 'plots-container';
    d.style.width = '100%';
    d.style.textAlign = 'center';

    let plotId = 1;

    for (let i = 1; i <= this.dimensions.height; i++) {
      for (let i = 1; i <= this.dimensions.width; i++) {
        // Create Plot object and attach it to this Garden
        const plot = this.createPlot({key: plotId.toString(), engine: this.engine, count: 1, display: `Plot ${plotId.toString()}`});

        // Attach Plot to DOM
        const DOMplot = plot.drawPlot(plotId);
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

  highlightAvailablePlots(highlight: boolean) {
    for (const plot in this.plots) {
      if (!this.plots[plot].seed) {
        this.plots[plot].highlightPlot(highlight);
      }
    }
  }
}