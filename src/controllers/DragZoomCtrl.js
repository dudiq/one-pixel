function getDistance(x1, x2, y1, y2) {
  // eslint-disable-next-line no-restricted-properties
  const ret = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return ret;
}
const browserPrefix = (() => {
  const styles = window.getComputedStyle(document.documentElement, ''); // CSSStyleDeclaration
  const browserMatch = (Array.prototype.slice
    .call(styles)
    .join('')
    .match(/-(moz|webkit|ms)-/)
    || (styles.OLink === '' && ['', 'o']))[1];

  return `-${browserMatch}-`;
})();

const CSS3_TRANSFORM = `${browserPrefix}transform`;
const CSS3_ORIGIN = `${browserPrefix}transform-origin`;

function getCenter(p1, p2) {
  return (p1 + p2) / 2;
}

export default class DragZoomCtrl {
  constructor(context) {
    this.context = context;
    const hooks = context.mouse.hooks;
    hooks.onDragZoom.on(this.onDragZoom);
    hooks.onDragZoomStart.on(this.onDragZoomStart);
    hooks.onDragZoomEnd.on(this.onDragZoomEnd);

    this.initials = {
      point: {
        x: 0,
        y: 0,
      },
      offset: {
        x: 0,
        y: 0,
      },
      matrix: null,
      scale: 1,
      initialDistance: 1,
    };
    this.last = {
      x: 0,
      y: 0,
    };
    this.drags = {
      prevDist: 0,
    };
  }

  init() {
    this.context.renderCtrl.hooks.onRenderEnd.on(this.dropStyles);
  }

  onDragZoomStart = () => {
    this.updateInitials();
  };

  updateInitials() {
    const pointFirst = this.context.mouse.pointFirst;
    const pointSecond = this.context.mouse.pointSecond;
    const initials = this.initials;

    initials.initialDistance = getDistance(
      pointFirst.x,
      pointSecond.x,
      pointFirst.y,
      pointSecond.y,
    );
    const offset = this.context.transformCtrl.offset();

    initials.point.x = getCenter(pointFirst.x, pointSecond.x);
    initials.point.y = getCenter(pointFirst.y, pointSecond.y);
    this.last.x = initials.point.x;
    this.last.y = initials.point.y;
    const drags = this.drags;
    drags.prevDist = initials.initialDistance;

    initials.scale = this.context.transformCtrl.scale();
    initials.offset.x = offset.x;
    initials.offset.y = offset.y;
    initials.matrix = this.context.transformCtrl.cloneMatrix();
  }

  getNextDistance() {
    const mouse = this.context.mouse;
    const pointFirst = mouse.pointFirst;
    const pointSecond = mouse.pointSecond;
    return getDistance(
      pointFirst.x,
      pointSecond.x,
      pointFirst.y,
      pointSecond.y,
    );
  }

  onDragZoom = () => {
    const context = this.context;
    const mouse = context.mouse;
    const initials = this.initials;
    const transformCtrl = context.transformCtrl;

    if (!mouse.isMiddleButton && context.touch.isFingerOne()) {
      this.updateInitials();
    }

    const nextDist = this.getNextDistance();
    const prevDist = this.drags.prevDist;

    this.drags.prevDist = nextDist;

    const k = prevDist === 0 || nextDist === 0 ? 1 : nextDist / prevDist;
    const nextScale = initials.scale * k;

    const centerX = getCenter(mouse.pointFirst.x, mouse.pointSecond.x);
    const centerY = getCenter(mouse.pointFirst.y, mouse.pointSecond.y);

    const dx = centerX - this.last.x;
    const dy = centerY - this.last.y;

    this.last.x = centerX;
    this.last.y = centerY;

    // const newMatrix = transformCtrl.getNewMatrix(
    //   centerX - this.initials.point.x,
    //   centerY - this.initials.point.y,
    //   k,
    // );

    transformCtrl.transformByCenter(dx, dy, centerX, centerY, k);

    this.context.renderCtrl.render();
    // const style = this.context.renderCtrl.screenCanvas.canvasElement.style;
    // style.transform = transformCtrl.getCssMatrix(newMatrix);
    // style.transformOrigin = `${centerX}px ${centerY}px`;
  };

  onDragZoomEnd = () => {
    this.context.renderCtrl.render();
  };

  dropStyles = () => {
    const style = this.context.renderCtrl.screenCanvas.canvasElement.style;
    style.transform = '';
    style.transformOrigin = '';
  };
}
