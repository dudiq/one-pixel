export default class Canvas {
  constructor() {
    const canvas = document.createElement('canvas');
    this.canvasElement = canvas;

    const ctx = canvas.getContext('2d');
    this.canvasContext = ctx;

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

  clearCanvas(x, y, w, h) {
    const ctx = this.canvasContext;
    ctx.clearRect(x, y, w, h);
  }
}
