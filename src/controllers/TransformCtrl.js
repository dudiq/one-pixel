import {
  scale,
  // TODO: add degree rotation
  rotateDEG,
  translate,
  identity,
  inverse,
  compose,
  applyToPoint,
  toCSS,
} from 'transformation-matrix';

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
        maxx: 100,
        maxy: 100,
      },
      scale: {
        min: 0.5,
        max: 1.5,
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
    this.context.canvas.setTransform(matrix);
  }

  getNewMatrix(x, y, scaleVal) {
    return compose(translate(x, y), scale(scaleVal, scaleVal));
  }

  getCssMatrix(matrix) {
    return toCSS(matrix);
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} scaleVal
   */
  updateMeta(x, y, scaleVal) {
    this.metaOffset.x = x;
    this.metaOffset.y = y;
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

  transformCenter(newMatrix, k, x, y, scaleVal) {
    scaleVal = this.getFloorScale(scaleVal);
    // this.updateMeta(x, y, scaleVal);

    const matrix = compose(translate(x, y), scale(scaleVal, scaleVal));
    this.setMatrix(matrix);
  }

  transform(x, y, scaleVal) {
    scaleVal = this.getFloorScale(scaleVal);
    x = this.getPointX(x);
    y = this.getPointY(y);

    this.updateMeta(x, y, scaleVal);

    const matrix = compose(
      identity(),
      translate(x, y),
      scale(scaleVal, scaleVal),
    );
    this.setMatrix(matrix);
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
