import BaseNode from './BaseNode';

export default class ImageNode extends BaseNode {
  render(node) {
    const context = this.context;
    const ctx = context.canvas.canvasContext;
    const imageMeta = context.images.getImageById(node.i);
    const points = node.p;

    ctx.drawImage(
      imageMeta.image,
      0,
      0,
      imageMeta.width,
      imageMeta.height,
      points[0],
      points[1],
      points[2],
      points[3],
    );
  }
}
