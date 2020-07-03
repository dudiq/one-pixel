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

    if (!mouse.isMiddleButton && context.touch.isFingerOne()) {
      this.updateInitials();
    }

    const nextDist = this.getNextDistance();
    const prevDist = this.drags.prevDist;

    this.drags.prevDist = nextDist;

    const k = prevDist === 0 || nextDist === 0 ? 1 : nextDist / prevDist;

    const centerX = getCenter(mouse.pointFirst.x, mouse.pointSecond.x);
    const centerY = getCenter(mouse.pointFirst.y, mouse.pointSecond.y);

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
