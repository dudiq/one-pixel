import BaseNode from './BaseNode';

export default class LineTo extends BaseNode {
  /**
   * @param {Canvas} canvas
   * @param {NodeLine} node
   */
  render(canvas, node) {
    const ctx = canvas.canvasContext;
    const points = node.p;
    const config = this.context.config;

    // white line
    ctx.beginPath();
    ctx.lineWidth = config.penSubWidth;
    ctx.lineCap = config.lineCap;
    ctx.moveTo(points[0], points[1]);
    for (let i = 2, l = points.length; i < l; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.strokeStyle = node.cs || config.penSubColor;
    ctx.stroke();
    ctx.closePath();

    // red line
    ctx.beginPath();
    ctx.lineWidth = config.penWidth;
    ctx.lineCap = config.lineCap;
    ctx.moveTo(points[0], points[1]);
    for (let i = 2, l = points.length; i < l; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.strokeStyle = node.c || config.penColor;
    ctx.stroke();
    ctx.closePath();
  }
}
