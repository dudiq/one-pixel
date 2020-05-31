import BaseTool from './BaseTool';

const NEAR_POS = 10;

export default class PenTool extends BaseTool {
  constructor(context) {
    super(context);
    this.config = context.config;
  }

  onMouseStart(point) {
    this.points = [];
    this.points.push({
      x: point.x,
      y: point.y,
    });

    this.points.push({
      x: point.x,
      y: point.y,
    });

    const ctx = this.context.canvas.canvasContext;
    ctx.beginPath();
    ctx.strokeStyle = this.config.penColor;
    ctx.lineWidth = this.config.penWidth;
    ctx.lineCap = this.config.lineCap;
    ctx.moveTo(point.x, point.y);
  }

  onMouseMove(point) {
    const prevPoint = this.points[this.points.length - 1];
    const isPassedX = Math.abs(prevPoint.x - point.x) > NEAR_POS;
    const isPassedY = Math.abs(prevPoint.y - point.y) > NEAR_POS;
    if (!(isPassedX || isPassedY)) {
      return;
    }

    console.log(
      Math.abs(prevPoint.x - point.x),
      Math.abs(prevPoint.y - point.y),
    );

    this.points.push({
      x: point.x,
      y: point.y,
    });

    const ctx = this.context.canvas.canvasContext;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  onMouseEnd(point) {
    this.points.push({
      x: point.x,
      y: point.y,
    });
    const ctx = this.context.canvas.canvasContext;
    ctx.closePath();
  }
}
