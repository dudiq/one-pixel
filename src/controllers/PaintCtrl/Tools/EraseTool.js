import { NODE_TYPES } from '@/constants';
import BaseTool from './BaseTool';

const NEAR_POS = 10;

export default class PenTool extends BaseTool {
  constructor(context) {
    super(context);
    this.config = context.config;
  }

  onMouseStart(point) {
    this.points = [];
    this.points.push(point.x, point.y);

    const ctx = this.context.canvas.canvasContext;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();

    ctx.lineWidth = this.config.eraseWidth;
    ctx.moveTo(point.x, point.y);
    this.renderErase(point);
  }

  onMouseMove(point) {
    const prevY = this.points[this.points.length - 1];
    const prevX = this.points[this.points.length - 2];

    const isPassedX = Math.abs(prevX - point.x) > NEAR_POS;
    const isPassedY = Math.abs(prevY - point.y) > NEAR_POS;
    if (!(isPassedX || isPassedY)) {
      return;
    }

    this.points.push(point.x, point.y);

    this.renderErase(point);
  }

  onMouseEnd(point) {
    this.points.push(point.x, point.y);
    const ctx = this.context.canvas.canvasContext;
    this.renderErase(point);
    ctx.globalCompositeOperation = 'source-over';
  }

  renderErase(point) {
    const ctx = this.context.canvas.canvasContext;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.closePath();
  }

  getNewNode() {
    return {
      i: this.getNewId(),
      t: NODE_TYPES.NODE_ERASER,
      p: [...this.points],
    };
  }
}
