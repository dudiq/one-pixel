export default class Canvas {
  constructor(context) {
    this.context = context;
    const el = context.element;
    const canvas = document.createElement('canvas');
    this.canvasElement = canvas;
    this.setSize(el.clientWidth, el.clientHeight);

    el.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    this.canvasContext = ctx;
    this.ctx = ctx;

    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  }

  setSize(w, h) {
    this.canvasElement.width = w;
    this.canvasElement.height = h;
  }

  setTransform(matrix) {
    this.canvasContext.setTransform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e,
      matrix.f,
    );
  }

  clearCanvas(p1, p2) {
    const ctx = this.canvasContext;
    ctx.clearRect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1]);
  }

  destroy() {}
}
