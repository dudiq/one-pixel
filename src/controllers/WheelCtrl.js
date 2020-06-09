export default class WheelCtrl {
  constructor(context) {
    this.context = context;
    context.mouse.hooks.onWheel.on(this.onWheel);
  }

  onWheel = (scaleDx, dx, dy, cx, cy) => {
    const scale = this.context.transformCtrl.scale();
    const newScale = scale - scaleDx;
    this.context.transformCtrl.transformByCenter(
      -dx,
      -dy,
      cx,
      cy,
      newScale / scale,
    );
    this.context.renderCtrl.render();
  };
}
