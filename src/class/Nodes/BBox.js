export default class BBox {
  constructor(context) {
    this.context = context;
    this.bboxes = {};
  }

  createBbox() {
    return {
      minx: Infinity,
      maxx: -Infinity,
      miny: Infinity,
      maxy: -Infinity,
      w: 0,
      h: 0,
    };
  }

  updateBboxByPoint(bbox, x, y) {
    bbox.minx > x && (bbox.minx = x);
    bbox.maxx < x && (bbox.maxx = x);

    bbox.miny > y && (bbox.miny = y);
    bbox.maxy < y && (bbox.maxy = y);
  }

  updateBboxDimensions(bbox) {
    bbox.w = bbox.maxx - bbox.minx;
    bbox.h = bbox.maxy - bbox.miny;
  }

  addBbox(node) {
    if (!node.p) return;

    const bbox = this.createBbox();
    const points = node.p;
    for (let i = 0, l = points.length; i < l; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      this.updateBboxByPoint(bbox, x, y);
    }
    this.updateBboxDimensions(bbox);
    this.bboxes[node.i] = bbox;
  }

  getBboxById(id) {
    return this.bboxes[id];
  }

  removeBboxById(id) {
    delete this.bboxes[id];
  }
}
