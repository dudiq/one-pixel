export default class BaseTool {
  constructor(context) {
    this.context = context;
    this.points = [];
  }

  onMouseStart(point) {}

  onMouseMove(point) {}

  onMouseEnd() {}

  getPoints() {
    return this.points;
  }
}
