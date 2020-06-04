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
    const radio = context.radio;
    const events = context.mouse.events;
    radio.on(events.onWheel, this.onWheel, this);
    radio.on(events.onDragZoom, this.onDragZoom, this);
    radio.on(events.onDragZoomStart, this.onDragZoomStart, this);
    radio.on(events.onDragZoomEnd, this.onDragZoomEnd, this);

    this.dragOffset = {
      x: 0,
      y: 0,
    };

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
  }

  onWheel(scaleDx, dx, dy) {
    const scale = this.context.transformCtrl.scale();
    const offset = this.context.transformCtrl.offset();
    this.context.transformCtrl.transform(
      offset.x - dx,
      offset.y - dy,
      scale - scaleDx,
    );
    this.context.drawCtrl.redraw();
  }

  onDragZoomStart() {
    this.updateInitials();
  }

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

  onDragZoom() {
    const context = this.context;
    const mouse = context.mouse;
    const initials = this.initials;
    const transformCtrl = context.transformCtrl;

    if (context.touch.isFingerOne()) {
      this.updateInitials();
    }

    const nextDist = this.getNextDistance();
    const prevDist = initials.initialDistance;
    const k = prevDist === 0 || nextDist === 0 ? 1 : nextDist / prevDist;
    const nextScale = initials.scale * k;

    const centerX = getCenter(mouse.pointFirst.x, mouse.pointSecond.x);
    const centerY = getCenter(mouse.pointFirst.y, mouse.pointSecond.y);

    const dx = centerX - initials.point.x;
    const dy = centerY - initials.point.y;

    const newMatrix = transformCtrl.getNewMatrix(dx, dy, k);

    transformCtrl.transform(
      initials.offset.x + dx,
      initials.offset.y + dy,
      nextScale,
    );

    const style = this.context.element.style;
    style.transform = transformCtrl.getCssMatrix(newMatrix);
    style.transformOrigin = `${initials.offset.x}px ${initials.offset.y}px`;
  }

  onDragZoomEnd() {
    this.context.drawCtrl.redraw();
    const style = this.context.element.style;
    style.transform = '';
  }

  fitToScreen() {
    // var modelW = canvas.getModelWidth();
    // var modelH = canvas.getModelHeight();
    // var newScaleX = canvas.w / modelW;
    // var newScaleY = canvas.h / modelH;
    // var newScale = Math.min(newScaleX, newScaleY);
    // newScale = scale.floorVal(newScale);
    // if (newScale) {
    //   //at first, set zoom for correct offset
    //   this.zoom(100);
    //   var off = canvas.getModelOffset();
    //
    //   // set center point
    //   var cx = Math.floor(off.x + modelW/2);
    //   var cy = Math.floor(off.y + modelH/2);
    //   this.setOffset(-cx, -cy);
    //
    //   // scale to new zoom
    //   this.zoom(newScale);
    // }
    // return this;
  }
}
