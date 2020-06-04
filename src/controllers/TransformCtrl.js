import {
  scale,
  // TODO: add degree rotation
  rotateDEG,
  translate,
  identity,
  inverse,
  compose,
  applyToPoint,
} from 'transformation-matrix';

export default class TransformsCtrl {
  constructor(context) {
    this.context = context;

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
  }

  /**
   * @param {PointObjectNotation | PointArrayNotation} point
   * @return {PointArrayNotation}
   */
  getTransPoint(point) {
    return applyToPoint(this.inverse, point);
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

  setMatrix(matrix) {
    this.matrix = matrix;
    this.inverse = inverse(this.matrix);
    this.context.canvas.setTransform(matrix);
  }

  transform(x, y, scaleVal) {
    this.metaOffset.x = x;
    this.metaOffset.y = y;
    this.metaScale.scale = scaleVal;
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
