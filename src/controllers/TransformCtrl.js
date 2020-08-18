import {
  scale,
  translate,
  identity,
  inverse,
  transform,
  rotateDEG,
  compose,
  applyToPoint,
  fromObject,
} from 'transformation-matrix';

const getSVGPoint = (value, viewerX, viewerY) => {
  const matrix = fromObject(value);

  const inverseMatrix = inverse(matrix);

  return applyToPoint(inverseMatrix, { x: viewerX, y: viewerY });
};

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

    this.metaRotate = {
      rotate: 0,
      x: 1,
      y: 1,
    };

    this.limitations = {
      scale: {
        min: 0.1,
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

    this.setMatrix(identity());
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

  rotate(val) {
    if (val === undefined) return this.metaScale.rotate;

    const offset = this.metaOffset;
    this.transform(offset.x, offset.y, this.metaScale.scale, val);
    return this.metaScale.rotate;
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

  isAbleToApplyMatrix(matrix) {
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

    const isBottomGone = leftTop.y > h;
    const isTopGone = rightBottom.y < 0;
    const isRightGone = leftTop.x > w;
    const isLeftGone = rightBottom.x < 0;

    const isAreaGoneFromScreen = isBottomGone || isTopGone || isRightGone || isLeftGone;

    if (isAreaGoneFromScreen) return false;

    return true;
  }

  /**
   * @private
   * @param {number} scaleVal
   */
  updateMeta(matrix, scaleVal) {
    const po = applyToPoint(matrix, [0, 0]);
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

    const nx = dx * this.metaRotate.cos - dy * this.metaRotate.sin;
    const ny = dx * this.metaRotate.sin + dy * this.metaRotate.cos;

    const matrix = transform(
      fromObject(this.matrix),

      scale(1 / oldScale),
      translate(nx, ny),
      scale(oldScale),

      translate(svgPoint.x, svgPoint.y),
      scale(scaleFactor),
      translate(-svgPoint.x, -svgPoint.y),
    );

    const isAbleToApplyMatrix = this.isAbleToApplyMatrix(matrix);
    if (!isAbleToApplyMatrix) return;

    this.setMatrix(matrix);
    this.updateMeta(matrix, scaleVal);
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} scaleVal
   */
  transform(x, y, scaleVal, angleDeg = this.metaRotate.rotate) {
    if (angleDeg >= 360) {
      angleDeg -= 360;
    }
    scaleVal = this.getFloorScale(scaleVal);

    const availableBbox = this.availableBbox;

    const cx = availableBbox.maxx / 2;
    const cy = availableBbox.maxy / 2;

    const matrix = compose(translate(x, y), scale(scaleVal));

    const rotateMatrix = compose(matrix, rotateDEG(angleDeg, cx, cy));

    const isAbleToApplyMatrix = this.isAbleToApplyMatrix(matrix);
    if (!isAbleToApplyMatrix) return;

    this.metaRotate.cos = Math.round(Math.cos(-angleDeg * (Math.PI / 180)));
    this.metaRotate.sin = Math.round(Math.sin(-angleDeg * (Math.PI / 180)));
    this.metaRotate.rotate = angleDeg;

    this.setMatrix(rotateMatrix);
    this.updateMeta(matrix, scaleVal);
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
