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
      x: 0,
      y: 0,
      scale: 1,
      initialDistance: 1,
    };
  }

  onWheel(scaleDx, xdx, ydx) {
    const scale = this.context.transformCtrl.scale();
    const offset = this.context.transformCtrl.offset();
    this.context.transformCtrl.transform(
      offset.x - xdx,
      offset.y - ydx,
      scale - scaleDx,
    );
    this.context.drawCtrl.redraw();
  }

  onDragZoomStart() {
    this.updateInitials();
    this.updateOffset();
  }

  updateOffset() {
    const dragOffset = this.dragOffset;
    dragOffset.x = this.context.mouse.pointFirst.x;
    dragOffset.y = this.context.mouse.pointFirst.y;
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
    initials.scale = this.context.transformCtrl.scale();
    const offset = this.context.transformCtrl.offset();
    initials.x = offset.x;
    initials.y = offset.y;
  }

  onDragZoom() {
    const dragOffset = this.dragOffset;
    const context = this.context;
    const mouse = context.mouse;

    if (context.touch.isFingerOne()) {
      this.updateInitials();
    }

    const dx = dragOffset.x - mouse.pointFirst.x;
    const dy = dragOffset.y - mouse.pointFirst.y;

    const pointFirst = mouse.pointFirst;
    const pointSecond = mouse.pointSecond;
    const nextDist = getDistance(
      pointFirst.x,
      pointSecond.x,
      pointFirst.y,
      pointSecond.y,
    );
    const prevDist = this.initials.initialDistance;
    const k = prevDist === 0 || nextDist === 0 ? 1 : nextDist / prevDist;

    const nextScale = this.initials.scale * k;

    const centerPointX = pointFirst.x + pointSecond.x / 2;
    const centerPointY = pointFirst.y + pointSecond.y / 2;

    this.context.transformCtrl.transformByCenterPoint(
      centerPointX,
      centerPointY,
      dx,
      dy,
      nextScale,
    );
    this.updateOffset();
    this.context.drawCtrl.redraw();

    // const trOffset = context.transformCtrl.offset();
    // const cssPoint = context.transformCtrl.getOffPoint(trOffset);
    // this.setCssTransforms(cssPoint.x, cssPoint.y, 0, 0, nextScale, 0);
  }

  onDragZoomEnd() {
    this.context.drawCtrl.redraw();
    this.setCssTransforms(0, 0, 0, 0, 1, 0);
  }

  setCssTransforms(offsetx, offsety, centerX, centerY, scaleVal, rotateVal) {
    const style = this.context.element.style;

    const val = `${centerX - offsetx}px ${centerY - offsety}px 0px`;
    style[CSS3_ORIGIN] != val && (style[CSS3_ORIGIN] = val);
    style['transform-origin'] != val && (style['transform-origin'] = val);
    style.transformOrigin != val && (style.transformOrigin = val);

    const transVal = `translate3d(${offsetx}px, ${offsety}px, 0px) scale(${scaleVal}) rotate(${rotateVal}deg)`;
    style[CSS3_TRANSFORM] != transVal && (style[CSS3_TRANSFORM] = transVal);
    style.transform != transVal && (style.transform = transVal);
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
