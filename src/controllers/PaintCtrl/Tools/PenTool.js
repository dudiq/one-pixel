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
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.strokeStyle = this.config.penColor;
    ctx.lineWidth = this.config.penWidth;
    ctx.lineCap = this.config.lineCap;
    ctx.moveTo(point.x, point.y);
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

    const ctx = this.context.canvas.canvasContext;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  onMouseEnd(point) {
    this.points.push(point.x, point.y);
    const ctx = this.context.canvas.canvasContext;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.closePath();
  }

  getNewNode() {
    return {
      i: this.getNewId(),
      t: NODE_TYPES.NODE_LINE,
      p: [...this.points],
    };
  }
}
