import BaseNode from './BaseNode';

export default class EraserNode extends BaseNode {
  render(node) {
    const ctx = this.context.canvas.canvasContext;
    const points = node.p;
    const config = this.context.config;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.lineWidth = config.eraseWidth;
    ctx.lineCap = config.lineCap;
    ctx.moveTo(points[0], points[1]);
    for (let i = 2, l = points.length; i < l; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';
  }
}
