import {
  scale,
  rotate,
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

    this.meta = {
      x: 0,
      y: 0,
      scale: 0,
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
    this.meta.x = x;
    this.meta.y = y;
    // offset(x, y) {
    //   this.matrix = compose(identity(), translate(x, y));
    //   this.setTransform(this.matrix);
    // }
  }

  scale(val, x = 0, y = 0) {
    this.meta.scale = val;
    const matrix = compose(identity(), scale(val, val));
    this.setMatrix(matrix);
  }

  setMatrix(matrix) {
    this.matrix = matrix;
    this.inverse = inverse(this.matrix);
    this.context.canvas.setTransform(matrix);
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
