import {
  scale,
  translate,
  identity,
  inverse,
  transform,
  compose,
  applyToPoint,
  toCSS,
  fromObject,
} from 'transformation-matrix';

const MAX_SIZE = 2000;

const getSVGPoint = (value, viewerX, viewerY) => {
  const matrix = fromObject(value);

  const inverseMatrix = inverse(matrix);

  return applyToPoint(inverseMatrix, { x: viewerX, y: viewerY });
};

export default class TransformsCtrl {
  constructor(context) {
    this.context = context;
    this.matrix = null;
    this.setMatrix(identity());

    /**
     * @private
     * @type {{x: number, y: number}}
     */
    this.metaOffset = {
      x: 0,
      y: 0,
    };

    /**
     * @private
     * @type {{scale: number}}
     */
    this.metaScale = {
      scale: 1,
    };

    this.limitations = {
      offset: {
        minx: -100,
        miny: -100,
        maxx: 200,
        maxy: 200,
      },
      scale: {
        min: 0.5,
        max: 3.5,
      },
    };
  }

  /**
   * @param {PointObjectNotation | PointArrayNotation} point
   * @return {PointArrayNotation}
   */
  getTransPoint(point) {
    return applyToPoint(this.inverse, point);
  }

  cloneMatrix() {
    return compose(this.matrix);
  }

  offset(x, y) {
    if (x === undefined || y === undefined) return this.metaOffset;
    this.transform(x, y, this.metaScale.scale);
    return this.metaOffset;
  }

  scale(val) {
    if (val === undefined) return this.metaScale.scale;

    const offset = this.metaOffset;
    this.transform(offset.x, offset.y, val);
    return this.metaScale.scale;
  }

  /**
   * @private
   * @param matrix
   */
  setMatrix(matrix) {
    this.matrix = matrix;
    this.inverse = inverse(this.matrix);
    const levels = this.context.canvasLevel.getLevels();
    for (let i = 0, l = levels.length; i < l; i++) {
      levels[i].canvas.setTransform(matrix);
    }
  }

  getNewMatrix(x, y, scaleVal) {
    return compose(translate(x, y), scale(scaleVal));
  }

  getCssMatrix(matrix) {
    return toCSS(matrix);
  }

  /**
   * @private
   * @param {number} scaleVal
   */
  updateMeta(scaleVal) {
    const po = applyToPoint(this.matrix, [0, 0]);
    po[0] = Math.floor(po[0] * 10) / 10;
    po[1] = Math.floor(po[1] * 10) / 10;

    this.metaOffset.x = po[0];
    this.metaOffset.y = po[1];
    this.metaScale.scale = scaleVal;
  }

  /**
   * @private
   * @param {number} scaleVal
   * @return {number}
   */
  getFloorScale(scaleVal) {
    const limits = this.limitations.scale;
    if (limits.max < scaleVal) return limits.max;
    if (limits.min > scaleVal) return limits.min;
    return Math.floor(scaleVal * 1000) / 1000;
  }

  /**
   * @private
   * @param {number} x
   * @return {number}
   */
  getPointX(x) {
    const limits = this.limitations.offset;
    if (limits.maxx < x) return limits.maxx;
    if (limits.minx > x) return limits.minx;
    return x;
  }

  /**
   * @private
   * @param {number} y
   * @return {number}
   */
  getPointY(y) {
    const limits = this.limitations.offset;
    if (limits.maxy < y) return limits.maxy;
    if (limits.miny > y) return limits.miny;
    return y;
  }

  transformByCenter(dx, dy, cx, cy, scaleFactor) {
    const scaleVal = this.getFloorScale(this.scale() * scaleFactor);

    const svgPoint = getSVGPoint(this.matrix, cx, cy);

    const matrix = transform(
      fromObject(this.matrix),
      translate(dx, dy),
      translate(svgPoint.x, svgPoint.y),
      scale(scaleFactor),
      translate(-svgPoint.x, -svgPoint.y),
    );

    this.setMatrix(matrix);
    this.updateMeta(scaleVal);
  }

  transform(x, y, scaleVal) {
    scaleVal = this.getFloorScale(scaleVal);
    x = this.getPointX(x);
    y = this.getPointY(y);

    const matrix = compose(translate(x, y), scale(scaleVal));
    this.setMatrix(matrix);
    this.updateMeta(scaleVal);
  }

  getClearRect(x, y, w, h) {
    const p1 = this.getTransPoint([x, y]);
    const p2 = this.getTransPoint([w, h]);
    return {
      p1,
      p2,
    };
  }
}
