import boxBox from 'intersects/box-box';
import polygonBox from 'intersects/polygon-box';

export default class CrossingRulers {
  constructor(context) {
    this.context = context;
  }

  isClipCrossNode(clip, node) {
    const points = node.p;
    if (!points) return false;

    const nodeBbox = this.context.bbox.getBboxById(node.i);
    if (!nodeBbox) return false;
    if (
      !boxBox(
        clip.minx,
        clip.miny,
        clip.w,
        clip.h,
        nodeBbox.minx,
        nodeBbox.miny,
        nodeBbox.w,
        nodeBbox.h,
      )
    ) return false;
    return polygonBox(points, clip.minx, clip.miny, clip.w, clip.h);
  }
}
