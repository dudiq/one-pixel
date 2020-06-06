import Canvas from './Canvas';

export default class CanvasLevel {
  constructor(context) {
    this.context = context;
    this.levels = [];
  }

  createCanvas() {
    const context = this.context;
    return new Canvas(context);
  }

  addCanvas(canvas) {
    const level = {
      canvas,
    };
    this.levels.push(level);
    return level;
  }

  getLevels() {
    return this.levels;
  }

  destroy() {
    this.levels.length = 0;
  }
}
