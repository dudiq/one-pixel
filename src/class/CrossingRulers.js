import boxBox from 'intersects/box-box';
import polygonBox from 'intersects/polygon-box';

export default class CrossingRulers {
  constructor(context) {
    this.context = context;
  }

  isPointCrossNode(x, y, node, dimension = 1) {
    const points = node.p;
    if (!points) return false;

    const nodeBbox = this.context.bbox.getBboxById(node.i);
    if (!nodeBbox) return false;
    if (
      !boxBox(
        x,
        y,
        dimension,
        dimension,
        nodeBbox.minx,
        nodeBbox.miny,
        nodeBbox.w,
        nodeBbox.h,
      )
    ) return false;
    return polygonBox(points, x, y, dimension, dimension);
  }
}
