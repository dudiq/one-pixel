import BaseNode from './BaseNode';

export default class ImageNode extends BaseNode {
  render(canvas, node) {
    const context = this.context;
    const imageMeta = context.images.getImageById(node.i);

    const ctx = canvas.canvasContext;
    const points = node.p;

    if (points) {
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
    } else {
      ctx.drawImage(imageMeta.image, 0, 0, imageMeta.width, imageMeta.height);
    }
  }
}
