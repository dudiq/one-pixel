function getDistance(x1, x2, y1, y2) {
  // eslint-disable-next-line no-restricted-properties
  const ret = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return ret;
}

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

    this.last = {
      x: 0,
      y: 0,
    };
    this.drags = {
      prevDist: 0,
      isMultiDrag: true,
    };
  }

  init() {
    this.context.renderCtrl.hooks.onRenderEnd.on(this.dropStyles);
  }

  onDragZoomStart = ({ isMultiDrag = true } = {}) => {
    this.drags.isMultiDrag = isMultiDrag;
    this.updateInitials();
  };

  updateInitials() {
    const pointFirst = this.context.mouse.pointFirst;
    const pointSecond = this.drags.isMultiDrag
      ? this.context.mouse.pointSecond
      : this.context.mouse.pointFirst;

    const initialDistance = getDistance(
      pointFirst.x,
      pointSecond.x,
      pointFirst.y,
      pointSecond.y,
    );

    this.last.x = getCenter(pointFirst.x, pointSecond.x);
    this.last.y = getCenter(pointFirst.y, pointSecond.y);
    const drags = this.drags;
    drags.prevDist = initialDistance;
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
    const transformCtrl = context.transformCtrl;

    if (
      this.drags.isMultiDrag
      && !mouse.isMiddleButton
      && context.touch.isFingerOne()
    ) {
      this.updateInitials();
    }

    let k = 1;
    let centerX = mouse.pointFirst.x;
    let centerY = mouse.pointFirst.y;

    if (this.drags.isMultiDrag) {
      const nextDist = this.getNextDistance();
      const prevDist = this.drags.prevDist;
      this.drags.prevDist = nextDist;
      k = prevDist === 0 || nextDist === 0 ? 1 : nextDist / prevDist;
      centerX = getCenter(mouse.pointFirst.x, mouse.pointSecond.x);
      centerY = getCenter(mouse.pointFirst.y, mouse.pointSecond.y);
    }

    const dx = centerX - this.last.x;
    const dy = centerY - this.last.y;

    this.last.x = centerX;
    this.last.y = centerY;

    transformCtrl.transformByCenter(dx, dy, centerX, centerY, k);

    this.context.renderCtrl.render();
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
