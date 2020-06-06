export default class WheelCtrl {
  constructor(context) {
    this.context = context;
    const radio = context.radio;
    const events = context.mouse.events;
    radio.on(events.onWheel, this.onWheel, this);
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
}
