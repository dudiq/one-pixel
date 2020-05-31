import BaseNode from './BaseNode';

export default class LineTo extends BaseNode {
  render(node) {
    const ctx = this.context.canvas.canvasContext;
    const points = node.p;
    const config = this.context.config;

    ctx.beginPath();
    ctx.lineWidth = config.penWidth;
    ctx.moveTo(points[0], points[1]);
    ctx.lineTo(points[2], points[3]);
    ctx.strokeStyle = config.penColor;
    ctx.stroke();
    ctx.closePath();
  }
}
