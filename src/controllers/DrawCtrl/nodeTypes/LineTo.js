import BaseNode from './BaseNode';

export default class LineTo extends BaseNode {
  render(node) {
    const ctx = this.context.canvas.canvasContext;
    const points = node.p;
    const config = this.context.config;

    ctx.beginPath();
    ctx.lineWidth = config.penWidth;
    ctx.lineCap = config.lineCap;
    ctx.moveTo(points[0], points[1]);
    for (let i = 2, l = points.length; i < l; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.strokeStyle = config.penColor;
    ctx.stroke();
    ctx.closePath();
  }
}
