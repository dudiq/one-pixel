export default class GestureCtrl {
  constructor(context) {
    this.context = context;
    const radio = context.radio;
    radio.on(context.mouse.events.onWheel, this.onWheel);
    radio.on(context.mouse.events.onGestureStart, this.onGestureStart);
    radio.on(context.mouse.events.onGestureMove, this.onGestureMove);
    this.meta = {
      x: 0,
      y: 0,
      scale: 1,
    };
  }

  onWheel = (scaleDx, xdx, ydx) => {
    let scale = this.context.transformCtrl.scale();
    scale -= scaleDx;
    let { x, y } = this.context.transformCtrl.offset();
    x -= xdx;
    y -= ydx;
    this.context.transformCtrl.transform(x, y, scale);
    this.context.drawCtrl.redraw();
  };

  onGestureStart = (x, y) => {
    this.meta.x = x;
    this.meta.y = y;
    this.meta.scale = this.context.transformCtrl.scale();
  };

  onGestureMove = (scale, x, y) => {
    const nscale = this.meta.scale * scale;
    const nx = x - this.meta.x;
    const ny = y - this.meta.y;
    this.context.transformCtrl.transform(nx, ny, nscale);
    this.context.drawCtrl.redraw();
  };
}
