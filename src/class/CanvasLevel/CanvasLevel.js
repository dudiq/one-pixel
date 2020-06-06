import Canvas from './Canvas';

export default class CanvasLevel {
  constructor(context) {
    this.context = context;
    this.levels = [];

    window.addEventListener('resize', this.onResize, false);
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

  forEachLevels(cb) {
    const levels = this.levels;
    for (let i = 0, l = levels.length; i < l; i++) {
      cb(levels[i].canvas);
    }
  }
}
