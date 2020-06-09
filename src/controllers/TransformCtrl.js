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

const getSVGPoint = (value, viewerX, viewerY) => {
  const matrix = fromObject(value);

  const inverseMatrix = inverse(matrix);

  return applyToPoint(inverseMatrix, { x: viewerX, y: viewerY });
};

const DX_CHANGE = 1000;

export default class TransformsCtrl {
  constructor(context) {
    this.context = context;
    this.matrix = null;

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
      scale: {
        min: 0.5,
        max: 3.5,
      },
    };

    this.availableBbox = {
      minx: 0,
      miny: 0,
      maxx: 0,
      maxy: 0,
      w: 0,
      h: 0,
    };

    this.setMatrix(identity(), 1);
  }

  init() {
    this.context.images.hooks.onLoaded.on(this.onAddAllNodes);
  }

  /**
   * @private
   */
  onAddAllNodes = () => {
    const nodes = this.context.nodes.getNodes();
    const node = nodes[0];

    if (!node) return;
    const image = this.context.images.getImageById(node.i);

    if (!image) return;
    const dx = 0;
    this.availableBbox = {
      minx: -dx,
      miny: -dx,
      maxx: image.width + dx,
      maxy: image.height + dx,
      w: image.width,
      h: image.height,
    };
  };

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
   * @param scaleVal
   */
  setMatrix(matrix, scaleVal) {
    this.matrix = matrix;
    this.inverse = inverse(this.matrix);
    const levels = this.context.canvasLevel.getLevels();
    for (let i = 0, l = levels.length; i < l; i++) {
      levels[i].canvas.setTransform(matrix);
    }
    this.updateMeta(scaleVal);
  }

  isOffsetCorrect(matrix) {
    const availableBbox = this.availableBbox;
    const container = this.context.container;
    const w = container.getWidth();
    const h = container.getHeight();

    const leftTop = applyToPoint(matrix, {
      x: availableBbox.minx,
      y: availableBbox.miny,
    });
    const rightBottom = applyToPoint(matrix, {
      x: availableBbox.maxx,
      y: availableBbox.maxy,
    });

    if (leftTop.x < -DX_CHANGE) return false;
    if (rightBottom.x > w + DX_CHANGE) return false;

    if (leftTop.y < -DX_CHANGE) return false;
    if (rightBottom.y > h + DX_CHANGE) return false;
    return true;
  }

  // getNewMatrix(x, y, scaleVal) {
  //   return compose(translate(x, y), scale(scaleVal));
  // }
  //
  // getCssMatrix(matrix) {
  //   return toCSS(matrix);
  // }

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

  transformByCenter(dx, dy, cx, cy, scaleFactor) {
    const oldScale = this.scale();
    const scaleVal = this.getFloorScale(oldScale * scaleFactor);
    scaleFactor = scaleVal / oldScale;

    const svgPoint = getSVGPoint(this.matrix, cx, cy);

    const matrix = transform(
      fromObject(this.matrix),
      translate(dx, dy),
      translate(svgPoint.x, svgPoint.y),
      scale(scaleFactor),
      translate(-svgPoint.x, -svgPoint.y),
    );

    const isOffsetCorrect = this.isOffsetCorrect(matrix);
    if (!isOffsetCorrect) return;

    this.setMatrix(matrix, scaleVal);
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} scaleVal
   */
  transform(x, y, scaleVal) {
    scaleVal = this.getFloorScale(scaleVal);

    const matrix = compose(translate(x, y), scale(scaleVal));

    const isOffsetCorrect = this.isOffsetCorrect(matrix);
    if (!isOffsetCorrect) return;

    this.setMatrix(matrix, scaleVal);
  }

  fitToScreen() {
    const availableBbox = this.availableBbox;
    const container = this.context.container;
    const w = container.getWidth();
    const h = container.getHeight();

    const modelW = availableBbox.w;
    const modelH = availableBbox.h;
    const newScaleX = w / modelW;
    const newScaleY = h / modelH;
    let newScale = Math.min(newScaleX, newScaleY);
    newScale = this.getFloorScale(newScale);
    if (newScale) {
      this.scale(1);
      this.offset(0, 0);

      const dx = (w - modelW) / 2;
      const dy = (h - modelH) / 2;

      const cx = modelW / 2;
      const cy = modelH / 2;

      this.transformByCenter(dx, dy, cx, cy, newScale);
    }
  }
}
